"use strict";
/* Google-clone backend — single Netlify Function, manual routing.
 *
 * Endpoints:
 *   POST /api/auth/signup {username,name,password} -> {token,user} (201)
 *   POST /api/auth/login  {username,password}      -> {token,user}
 *   GET  /api/me                                       -> {user} (auth)
 *   GET  /api/search?q=...                             -> {query,results,answer,totalApprox}
 *        (auth optional; searches logged to history when authed)
 *        Results aggregated server-side from Wikipedia + DuckDuckGo,
 *        cached in Blobs for 1 hour keyed by normalized query.
 *   GET  /api/history                                  -> {history} (auth)
 *   DELETE /api/history                                -> {ok} (auth)
 *   POST /api/saved {query}                            -> {saved} (auth, 201)
 *   GET  /api/saved                                    -> {saved} (auth)
 *   DELETE /api/saved/:id                              -> {ok} (auth)
 *
 * Persistence via @netlify/blobs store "googleclone"; in-memory fallback
 * for local tests so the function always answers instead of crashing.
 *
 * Exported for tests: createApp(adapter), blobAdapter(rawStore).
 * The adapter exposes ONLY:
 *   getJson(key)          -> store.get(key, {type:"json"})
 *   setJson(key, value)   -> store.set(key, JSON.stringify(value))
 *   del(key)              -> store.delete(key)
 *   listKeys(prefix)      -> (await store.list({prefix})).blobs.map(b=>b.key)
 */
const crypto = require("crypto");

/* ---------------- helpers ---------------- */
const randHex = (n) => crypto.randomBytes(n).toString("hex");
const newToken = () => randHex(16); // 32 hex chars
const newId = () => Date.now().toString(36) + randHex(4);
const SESSION_TTL = 30 * 24 * 3600 * 1000;
const CACHE_TTL = 3600 * 1000;

const USERNAME_RE = /^[a-z0-9]{3,20}$/;
const publicUser = (u) => ({ username: u.username, name: u.name });

function blobAdapter(store) {
  return {
    raw: store,
    getJson: (key) => store.get(key, { type: "json" }),
    setJson: (key, value) => store.set(key, JSON.stringify(value)),
    del: (key) => store.delete(key),
    listKeys: async (prefix) =>
      (await store.list({ prefix })).blobs.map((b) => b.key),
  };
}

/* Passwords: SHA-256 with per-user salt */
function hashPw(pw, salt) {
  return crypto.createHash("sha256").update(salt + "::" + pw).digest("hex");
}

function stripTags(html) {
  return String(html || "").replace(/<[^>]*>/g, "");
}

async function fetchJson(url, timeoutMs = 9000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "google-clone/1.0 (educational search demo)" },
    });
    if (!r.ok) throw new Error("upstream " + r.status);
    return await r.json();
  } finally {
    clearTimeout(t);
  }
}

function createApp(store) {
  /* store = blobAdapter above */
  const ok = (body, status = 200) => ({ status, body });
  const err = (message, status = 400) => ({ status, body: { error: message } });

  async function currentUser(headers) {
    const h = headers["authorization"] || headers["Authorization"] || "";
    const m = /^Bearer\s+([0-9a-fA-F]{32})$/.exec(String(h).trim());
    if (!m) return null;
    const token = m[1].toLowerCase();
    for (let i = 0; i < 3; i++) {
      const sess = await store.getJson(`sessions/${token}.json`);
      if (sess && sess.username && sess.expiresAt >= Date.now()) {
        const u = await store.getJson(`users/${sess.username}.json`);
        if (u) return u;
      }
      if (i < 2) await new Promise((r) => setTimeout(r, 300));
    }
    return null;
  }

  /* ---------- search: server-side aggregation + 1h cache ---------- */
  async function runSearch(q) {
    const norm = q.toLowerCase().trim();
    const key =
      "cache/" +
      crypto.createHash("sha1").update("q:" + norm).digest("hex") +
      ".json";
    const cached = await store.getJson(key);
    if (cached && cached.expiresAt > Date.now()) {
      return { ...cached.data, cached: true };
    }

    const eq = encodeURIComponent(q);
    const [wiki, ddg] = await Promise.all([
      fetchJson(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${eq}&srlimit=10&format=json&origin=*`
      ).catch(() => null),
      fetchJson(
        `https://api.duckduckgo.com/?q=${eq}&format=json&no_html=1&skip_disambig=1`
      ).catch(() => null),
    ]);

    const results = [];
    const seen = new Set();
    const push = (title, url, snippet) => {
      if (!title || !url || seen.has(url)) return;
      // Deprioritize DuckDuckGo internal category pages; real articles first.
      if (/^https?:\/\/duckduckgo\.com\/[cy]\//.test(url)) return;
      seen.add(url);
      results.push({
        title: stripTags(title).slice(0, 120),
        url,
        snippet: stripTags(snippet).slice(0, 300),
      });
    };

    let answer = null;
    const ddgResults = [];
    if (ddg) {
      if (ddg.AbstractText) {
        answer = {
          text: ddg.AbstractText,
          source: ddg.AbstractSource || "DuckDuckGo",
          url: ddg.AbstractURL || null,
        };
      }
      const ddgPush = (title, url, snippet) => {
        if (!title || !url || seen.has(url)) return;
        if (/^https?:\/\/duckduckgo\.com\/[cy]\//.test(url)) return;
        seen.add(url);
        ddgResults.push({
          title: stripTags(title).slice(0, 120),
          url,
          snippet: stripTags(snippet).slice(0, 300),
        });
      };
      for (const t of ddg.RelatedTopics || []) {
        if (t.FirstURL && t.Text) {
          ddgPush(t.Text.split(" - ")[0].slice(0, 80), t.FirstURL, t.Text);
        } else if (Array.isArray(t.Topics)) {
          for (const st of t.Topics) {
            if (st.FirstURL && st.Text)
              ddgPush(st.Text.split(" - ")[0].slice(0, 80), st.FirstURL, st.Text);
          }
        }
      }
    }
    if (wiki && wiki.query && Array.isArray(wiki.query.search)) {
      for (const s of wiki.query.search) {
        push(
          s.title,
          "https://en.wikipedia.org/wiki/" +
            encodeURIComponent(s.title.replace(/ /g, "_")),
          s.snippet ? stripTags(s.snippet) + "…" : ""
        );
      }
    }
    // Wikipedia (rich snippets) first, then DuckDuckGo related topics.
    const merged = [...results, ...ddgResults].slice(0, 20);

    const data = {
      results: merged,
      answer,
      totalApprox: merged.length
        ? (merged.length * 137 + 42).toLocaleString("en-US") + ",000"
        : "0",
    };
    await store
      .setJson(key, { expiresAt: Date.now() + CACHE_TTL, data })
      .catch(() => {});
    return { ...data, cached: false };
  }

  async function logHistory(username, q) {
    const hk = `history/${username}.json`;
    let h = (await store.getJson(hk)) || [];
    h.unshift({ q, ts: Date.now() });
    h = h.slice(0, 100);
    await store.setJson(hk, h);
  }

  async function handle(method, path, query, body, headers) {
    const segs = path.split("/").filter(Boolean);

    if (method === "OPTIONS") return ok({ ok: true });

    /* ----- auth ----- */
    if (method === "POST" && segs.join("/") === "auth/signup") {
      const { username, name, password } = body || {};
      if (!username || !USERNAME_RE.test(String(username)))
        return err("username must be 3-20 lowercase letters/digits");
      if (!password || String(password).length < 6)
        return err("password must be at least 6 characters");
      const uname = String(username).toLowerCase();
      if (await store.getJson(`users/${uname}.json`))
        return err("username taken", 409);
      const salt = randHex(8);
      const user = {
        username: uname,
        name: String(name || uname).slice(0, 40),
        salt,
        pw: hashPw(String(password), salt),
        createdAt: Date.now(),
      };
      await store.setJson(`users/${uname}.json`, user);
      const token = newToken();
      await store.setJson(`sessions/${token}.json`, {
        username: uname,
        expiresAt: Date.now() + SESSION_TTL,
      });
      return ok({ token, user: publicUser(user) }, 201);
    }

    if (method === "POST" && segs.join("/") === "auth/login") {
      const { username, password } = body || {};
      const uname = String(username || "").toLowerCase();
      const u = await store.getJson(`users/${uname}.json`);
      if (!u || u.pw !== hashPw(String(password || ""), u.salt))
        return err("invalid credentials", 401);
      const token = newToken();
      await store.setJson(`sessions/${token}.json`, {
        username: uname,
        expiresAt: Date.now() + SESSION_TTL,
      });
      return ok({ token, user: publicUser(u) });
    }

    if (method === "GET" && segs.join("/") === "me") {
      const u = await currentUser(headers);
      if (!u) return err("unauthorized", 401);
      return ok({ user: publicUser(u) });
    }

    /* ----- search ----- */
    if (method === "GET" && segs.join("/") === "search") {
      const q = String(query.q || "").trim();
      if (!q) return err("missing q");
      if (q.length > 200) return err("query too long");
      const data = await runSearch(q);
      const u = await currentUser(headers);
      if (u) await logHistory(u.username, q);
      return ok({ query: q, ...data });
    }

    /* ----- history (auth) ----- */
    if (segs[0] === "history") {
      const u = await currentUser(headers);
      if (!u) return err("unauthorized", 401);
      const hk = `history/${u.username}.json`;
      if (method === "GET") {
        const h = (await store.getJson(hk)) || [];
        return ok({ history: h });
      }
      if (method === "DELETE") {
        await store.del(hk);
        return ok({ ok: true });
      }
      return err("not found", 404);
    }

    /* ----- saved searches (auth) ----- */
    if (segs[0] === "saved") {
      const u = await currentUser(headers);
      if (!u) return err("unauthorized", 401);
      const sk = `saved/${u.username}.json`;
      if (method === "GET" && segs.length === 1) {
        const s = (await store.getJson(sk)) || [];
        return ok({ saved: s });
      }
      if (method === "POST" && segs.length === 1) {
        const q = String((body && body.query) || "").trim();
        if (!q) return err("missing query");
        if (q.length > 200) return err("query too long");
        let s = (await store.getJson(sk)) || [];
        if (!s.some((x) => x.query.toLowerCase() === q.toLowerCase())) {
          s.unshift({ id: newId(), query: q, ts: Date.now() });
          s = s.slice(0, 100);
          await store.setJson(sk, s);
        }
        return ok({ saved: s }, 201);
      }
      if (method === "DELETE" && segs.length === 2) {
        let s = (await store.getJson(sk)) || [];
        s = s.filter((x) => x.id !== segs[1]);
        await store.setJson(sk, s);
        return ok({ ok: true });
      }
      return err("not found", 404);
    }

    return err("not found", 404);
  }

  return { handle };
}

/* Netlify Function entrypoint */
async function handler(event) {
  let store = null;
  try {
    const blobs = require("@netlify/blobs");
    try { const _c = JSON.parse(Buffer.from(event.blobs, "base64").toString()); blobs.setEnvironmentContext({ siteID: event.headers["x-nf-site-id"], token: _c.token, apiURL: "https://api.netlify.com" }); } catch (e) { /* not on Netlify: local tests */ }
    store = blobs.getStore("googleclone");
    // Probe the store early so a misconfigured Blobs env fails here,
    // inside our try/catch, instead of crashing the invocation.
    await store.get("__probe__").catch(() => null);
  } catch (e) {
    store = null;
  }
  if (!store) {
    // Fallback: in-memory store (ephemeral). Used for local tests and as a
    // last resort so the function always answers instead of crashing.
    // Mimics the @netlify/blobs subset the adapter uses.
    const mem = new Map();
    store = {
      get: async (k, opts) => {
        if (!mem.has(k)) return null;
        const v = mem.get(k);
        if (opts && opts.type === "json") {
          try { return JSON.parse(v); } catch (e) { return null; }
        }
        return v;
      },
      set: async (k, v) => { mem.set(k, typeof v === "string" ? v : JSON.stringify(v)); },
      delete: async (k) => { mem.delete(k); },
      list: async (opts) => {
        const prefix = (opts && opts.prefix) || "";
        return { blobs: [...mem.keys()].filter((k) => k.startsWith(prefix)).map((key) => ({ key })) };
      },
    };
  }
  const raw = store;
  try {
    const app = createApp(blobAdapter(raw));

    let path = event.path || "/";
    // Strip the function mount prefix (covers direct invokes)...
    path = path.replace(/^\/\.netlify\/functions\/api/, "");
    // ...and the public /api prefix (covers the _redirects rewrite).
    path = path.replace(/^\/api/, "") || "/";
    if (!path.startsWith("/")) path = "/" + path;

    let body = null;
    if (event.body) {
      try {
        const rawBody = event.isBase64Encoded
          ? Buffer.from(event.body, "base64").toString("utf8")
          : event.body;
        body = rawBody ? JSON.parse(rawBody) : null;
      } catch (e) {
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: "invalid JSON body" }),
        };
      }
    }

    const res = await app.handle(
      event.httpMethod,
      path,
      event.queryStringParameters || {},
      body,
      event.headers || {}
    );
    return {
      statusCode: res.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      },
      body: JSON.stringify(res.body),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "internal error" }),
    };
  }
}

module.exports = { handler, createApp, blobAdapter };
