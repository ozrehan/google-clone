"use strict";
/* Google-clone frontend — tiny SPA talking to /api/*. */
(function () {
  const $ = (id) => document.getElementById(id);
  const PER_PAGE = 10;

  const state = {
    token: null, user: null, query: "", data: null, page: 1,
  };

  /* ---------- api ---------- */
  function headers() {
    const h = { "Content-Type": "application/json" };
    if (state.token) h["Authorization"] = "Bearer " + state.token;
    return h;
  }
  async function api(method, path, body) {
    const res = await fetch("/api" + path, {
      method,
      headers: headers(),
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || ("request failed " + res.status));
    return data;
  }

  function saveSession() {
    try {
      if (state.token) localStorage.setItem("g_token", state.token);
      else localStorage.removeItem("g_token");
    } catch (e) {}
  }
  function loadSession() {
    try { state.token = localStorage.getItem("g_token"); } catch (e) {}
  }

  /* ---------- theme ---------- */
  function setTheme(t) {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem("g_theme", t); } catch (e) {}
  }
  function toggleTheme() {
    setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  }
  try {
    if (localStorage.getItem("g_theme") === "dark") setTheme("dark");
    else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");
  } catch (e) {}

  /* ---------- views ---------- */
  function show(name) {
    $("homeView").hidden = name !== "home";
    $("resultsView").hidden = name !== "results";
    $("listView").hidden = name !== "list";
    window.scrollTo(0, 0);
  }
  function goHome() { show("home"); history.replaceState(null, "", "/"); }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function highlight(text, q) {
    const words = String(q).split(/\s+/).filter((w) => w.length > 1);
    let out = esc(text);
    for (const w of words) {
      const re = new RegExp("(" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
      out = out.replace(re, "<b>$1</b>");
    }
    return out;
  }
  function hostOf(url) {
    try { return new URL(url).hostname.replace(/^www\./, ""); } catch (e) { return url; }
  }
  function favLetter(url) {
    const h = hostOf(url);
    return esc((h[0] || "?").toUpperCase());
  }

  async function doSearch(q, lucky) {
    q = String(q || "").trim();
    if (!q) return;
    state.query = q; state.page = 1;
    $("resInput").value = q;
    show("results");
    $("resStats").textContent = "";
    $("resMain").innerHTML = '<p class="no-results">Loading…</p>';
    $("pagination").innerHTML = "";
    history.replaceState(null, "", "/?q=" + encodeURIComponent(q));
    const t0 = performance.now();
    try {
      const data = await api("GET", "/search?q=" + encodeURIComponent(q));
      if (lucky && data.results && data.results.length) {
        window.location.href = data.results[0].url;
        return;
      }
      state.data = data;
      renderResults(performance.now() - t0);
    } catch (e) {
      $("resMain").innerHTML = '<p class="no-results">Something went wrong: ' + esc(e.message) + "</p>";
    }
  }

  function renderResults(ms) {
    const d = state.data, q = state.query;
    const total = d.results.length;
    $("resStats").textContent =
      "About " + (d.totalApprox || total) + " results (" + (ms / 1000).toFixed(2) + " seconds)";
    let html = "";
    if (d.answer && d.answer.text) {
      html += '<div class="answer-box"><div>' + esc(d.answer.text).slice(0, 600) + "</div>" +
        '<div class="a-src">Source: ' +
        (d.answer.url ? '<a href="' + esc(d.answer.url) + '" target="_blank" rel="noopener">' + esc(d.answer.source) + "</a>" : esc(d.answer.source)) +
        "</div></div>";
    }
    const pages = Math.max(1, Math.ceil(total / PER_PAGE));
    if (state.page > pages) state.page = pages;
    const slice = d.results.slice((state.page - 1) * PER_PAGE, state.page * PER_PAGE);
    if (!slice.length) html += '<p class="no-results">No results found for <b>' + esc(q) + "</b>.</p>";
    for (const r of slice) {
      html += '<div class="result">' +
        '<div class="crumb"><span class="fav">' + favLetter(r.url) + "</span><span>" + esc(hostOf(r.url)) + "</span></div>" +
        '<h3><a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + highlight(r.title, q) + "</a></h3>" +
        '<div class="snippet">' + highlight(r.snippet || "", q) + "</div>" +
        (state.token ? '<div class="res-actions"><button class="link-btn" data-save="' + esc(r.title) + '">Save this search</button></div>' : "") +
        "</div>";
    }
    $("resMain").innerHTML = html;
    let pg = "";
    if (pages > 1) {
      for (let i = 1; i <= pages; i++)
        pg += '<button data-page="' + i + '"' + (i === state.page ? ' class="cur"' : "") + ">" + i + "</button>";
    }
    $("pagination").innerHTML = pg;
    $("resMain").querySelectorAll("[data-save]").forEach((b) =>
      b.addEventListener("click", () => saveSearch(state.query)));
  }

  /* ---------- history / saved ---------- */
  async function showList(kind) {
    if (!state.token) { openAuth(); return; }
    show("list");
    $("listTitle").textContent = kind === "history" ? "Search history" : "Saved searches";
    $("listItems").innerHTML = "<li>Loading…</li>";
    try {
      if (kind === "history") {
        const d = await api("GET", "/history");
        renderList(d.history.map((h) => ({ id: h.ts, label: h.q, ts: h.ts })), kind);
      } else {
        const d = await api("GET", "/saved");
        renderList(d.saved.map((s) => ({ id: s.id, label: s.query, ts: s.ts })), kind);
      }
    } catch (e) {
      $("listItems").innerHTML = "<li>Failed to load: " + esc(e.message) + "</li>";
    }
  }
  function renderList(items, kind) {
    const ul = $("listItems");
    if (!items.length) { ul.innerHTML = "<li>Nothing here yet.</li>"; return; }
    ul.innerHTML = "";
    for (const it of items) {
      const li = document.createElement("li");
      const a = document.createElement("span");
      a.className = "q"; a.textContent = it.label;
      a.addEventListener("click", () => doSearch(it.label));
      const ts = document.createElement("span");
      ts.className = "ts";
      ts.textContent = it.ts ? new Date(it.ts).toLocaleString() : "";
      const del = document.createElement("button");
      del.className = "del"; del.textContent = "✕"; del.title = "Remove";
      del.addEventListener("click", async () => {
        try {
          if (kind === "history") {
            await api("DELETE", "/history");
          } else {
            await api("DELETE", "/saved/" + encodeURIComponent(it.id));
          }
          showList(kind);
        } catch (e) { alert(e.message); }
      });
      li.append(a, ts, del);
      ul.appendChild(li);
    }
    if (kind === "history" && items.length) {
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.className = "link-btn clear-all"; b.textContent = "Clear all history";
      b.addEventListener("click", async () => { await api("DELETE", "/history"); showList(kind); });
      li.appendChild(b); ul.appendChild(li);
    }
  }
  async function saveSearch(q) {
    try {
      await api("POST", "/saved", { query: q });
      alert("Saved: " + q);
    } catch (e) { alert(e.message); }
  }

  /* ---------- auth ---------- */
  let authMode = "signin";
  function openAuth() {
    $("authModal").hidden = false;
    $("authErr").textContent = "";
    setAuthMode(authMode);
  }
  function setAuthMode(m) {
    authMode = m;
    $("tabSignin").classList.toggle("active", m === "signin");
    $("tabSignup").classList.toggle("active", m === "signup");
    $("authName").hidden = m !== "signup";
    $("authTitle").textContent = m === "signup" ? "Create account" : "Sign in";
    $("authGo").textContent = m === "signup" ? "Create account" : "Sign in";
  }
  async function doAuth() {
    const username = $("authUser").value.trim().toLowerCase();
    const password = $("authPass").value;
    const name = $("authName").value.trim();
    $("authErr").textContent = "";
    try {
      const d = authMode === "signup"
        ? await api("POST", "/auth/signup", { username, name, password })
        : await api("POST", "/auth/login", { username, password });
      state.token = d.token; state.user = d.user;
      saveSession(); refreshAuthUI();
      $("authModal").hidden = true;
      $("authPass").value = "";
    } catch (e) { $("authErr").textContent = e.message; }
  }
  function signOut() {
    state.token = null; state.user = null;
    saveSession(); refreshAuthUI();
  }
  function refreshAuthUI() {
    const label = state.user ? state.user.name : "Sign in";
    for (const id of ["signinBtn", "signinBtn2", "signinBtn3"]) {
      const b = $(id);
      if (b) b.textContent = label;
    }
  }
  async function ensureMe() {
    if (!state.token) return;
    try {
      const d = await api("GET", "/me");
      state.user = d.user;
    } catch (e) { state.token = null; state.user = null; saveSession(); }
    refreshAuthUI();
  }

  /* ---------- wire up ---------- */
  function bindClear(input, btn) {
    const upd = () => { btn.hidden = !input.value; };
    input.addEventListener("input", upd); upd();
    btn.addEventListener("click", () => { input.value = ""; upd(); input.focus(); });
  }
  $("homeForm").addEventListener("submit", (e) => { e.preventDefault(); doSearch($("homeInput").value); });
  $("searchBtn").addEventListener("click", (e) => { e.preventDefault(); doSearch($("homeInput").value); });
  $("luckyBtn").addEventListener("click", (e) => { e.preventDefault(); doSearch($("homeInput").value, true); });
  $("resForm").addEventListener("submit", (e) => { e.preventDefault(); doSearch($("resInput").value); });
  bindClear($("homeInput"), $("homeClear"));
  bindClear($("resInput"), $("resClear"));
  $("pagination").addEventListener("click", (e) => {
    const b = e.target.closest("[data-page]");
    if (b) { state.page = parseInt(b.dataset.page, 10); renderResults(0); window.scrollTo(0, 0); }
  });

  for (const id of ["miniLogo", "miniLogo2"]) $(id).addEventListener("click", (e) => { e.preventDefault(); goHome(); });
  $("navHistory").addEventListener("click", (e) => { e.preventDefault(); showList("history"); });
  $("navSaved").addEventListener("click", (e) => { e.preventDefault(); showList("saved"); });

  const appsMenu = $("appsMenu");
  $("appsBtn").addEventListener("click", (e) => { e.stopPropagation(); appsMenu.hidden = !appsMenu.hidden; });
  document.addEventListener("click", () => { appsMenu.hidden = true; });
  appsMenu.addEventListener("click", (e) => {
    const a = e.target.closest("[data-app]");
    if (!a) return;
    e.preventDefault();
    const app = a.dataset.app;
    if (app === "History") showList("history");
    else if (app === "Saved") showList("saved");
    else if (app === "Lucky") { const q = $("homeInput").value || "wikipedia"; doSearch(q, true); }
    else goHome();
  });

  $("themeBtn").addEventListener("click", toggleTheme);
  $("themeBtn2").addEventListener("click", toggleTheme);
  $("footSettings").addEventListener("click", (e) => { e.preventDefault(); toggleTheme(); });

  for (const id of ["signinBtn", "signinBtn2", "signinBtn3"]) {
    $(id).addEventListener("click", () => {
      if (state.user) { if (confirm("Sign out " + state.user.name + "?")) signOut(); }
      else openAuth();
    });
  }
  $("tabSignin").addEventListener("click", () => setAuthMode("signin"));
  $("tabSignup").addEventListener("click", () => setAuthMode("signup"));
  $("authGo").addEventListener("click", doAuth);
  $("authClose").addEventListener("click", () => { $("authModal").hidden = true; });
  $("authModal").addEventListener("click", (e) => { if (e.target === $("authModal")) $("authModal").hidden = true; });
  $("authPass").addEventListener("keydown", (e) => { if (e.key === "Enter") doAuth(); });

  /* ---------- init ---------- */
  loadSession();
  ensureMe();
  refreshAuthUI();
  const m = /[?&]q=([^&]*)/.exec(location.search);
  if (m) { $("homeInput").value = decodeURIComponent(m[1].replace(/\+/g, " ")); doSearch($("homeInput").value); }
})();
