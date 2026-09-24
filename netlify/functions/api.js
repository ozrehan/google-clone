'use strict';
/* api.js — ONE Netlify Function, manual routing. Node 20, CommonJS.
   Backs the Google clone: real search, suggestions, knowledge panels,
   images, news, per-client history (Netlify Blobs), trending. */

const rank = require('./rank');

/* Popular queries log (for suggestion boosting), kept in the blob store. */
const POPULAR_KEY = 'meta/popular.json';
const HISTORY_PREFIX = 'history/';

function cleanClientId(raw) {
  const id = String(raw || '').trim();
  return /^[A-Za-z0-9_-]{1,64}$/.test(id) ? id : null;
}

/* store interface: get(key, {type:'json'}), setJSON(key, val), delete(key) */
function createApp(store) {
  async function getJSON(key, fallback) {
    try {
      const v = await store.get(key, { type: 'json' });
      return v == null ? fallback : v;
    } catch (e) { return fallback; }
  }

  async function logQuery(q) {
    try {
      const pop = await getJSON(POPULAR_KEY, []);
      const list = Array.isArray(pop) ? pop : [];
      const entry = list.find(e => e.q === q);
      if (entry) entry.n = (entry.n || 1) + 1;
      else list.push({ q, n: 1 });
      list.sort((a, b) => b.n - a.n);
      await store.setJSON(POPULAR_KEY, list.slice(0, 60));
    } catch (e) { /* best effort */ }
  }

  async function route(method, path, query, headers, body) {
    query = query || {};
    headers = headers || {};

    // ---- GET /api/search ----
    if (method === 'GET' && path === '/search') {
      const q = String(query.q || '').trim();
      if (!q) return json(400, { error: 'missing q' });
      const tab = ['web', 'images', 'news'].includes(query.tab) ? query.tab : 'web';
      const res = rank.search(q, {
        tab,
        start: query.start, perPage: query.perPage,
        topic: query.chip,
      });
      const popular = (await getJSON(POPULAR_KEY, [])).map(e => e.q);
      res.suggestions = rank.suggest(q, popular).slice(1, 5);
      logQuery(q); // fire and forget (not awaited)
      return json(200, res);
    }

    // ---- GET /api/suggest ----
    if (method === 'GET' && path === '/suggest') {
      const popular = (await getJSON(POPULAR_KEY, [])).map(e => e.q);
      return json(200, { suggestions: rank.suggest(query.q || '', popular) });
    }

    // ---- GET /api/trending ----
    if (method === 'GET' && path === '/trending') {
      return json(200, { trending: rank.TRENDING.slice(0, 8) });
    }

    const clientId = cleanClientId(headers['x-client-id']);
    const hkey = clientId ? HISTORY_PREFIX + clientId + '.json' : null;

    // ---- GET /api/history ----
    if (method === 'GET' && path === '/history') {
      if (!hkey) return json(400, { error: 'missing x-client-id' });
      const h = await getJSON(hkey, []);
      return json(200, { history: Array.isArray(h) ? h : [] });
    }

    // ---- POST /api/history ----
    if (method === 'POST' && path === '/history') {
      if (!hkey) return json(400, { error: 'missing x-client-id' });
      let q = '';
      try { q = String((body && body.q) || '').trim(); } catch (e) {}
      if (!q) return json(400, { error: 'missing q' });
      const h = await getJSON(hkey, []);
      const list = Array.isArray(h) ? h : [];
      const next = [{ q, t: Date.now() },
        ...list.filter(x => String(x.q).toLowerCase() !== q.toLowerCase())].slice(0, 50);
      await store.setJSON(hkey, next);
      return json(200, { ok: true, history: next });
    }

    // ---- DELETE /api/history ----
    if (method === 'DELETE' && path === '/history') {
      if (!hkey) return json(400, { error: 'missing x-client-id' });
      await store.delete(hkey);
      return json(200, { ok: true });
    }

    return json(404, { error: 'not found' });
  }

  return { route };
}

function json(status, obj) {
  return { status, headers: { 'Content-Type': 'application/json' }, body: obj };
}

/* Netlify handler: builds the blob store, delegates to the app. */
exports.handler = async function (event) {
  try { const _b = require("@netlify/blobs"); const _c = JSON.parse(Buffer.from(event.blobs, "base64").toString()); _b.setEnvironmentContext({ siteID: event.headers["x-nf-site-id"], token: _c.token, apiURL: "https://api.netlify.com" }); } catch (e) { /* not on Netlify: local tests */ }
  const { getStore } = require('@netlify/blobs');
  const store = getStore('google');
  const app = createApp(store);

  let path = event.path || '/';
  // strip the function mount prefix (/.netlify/functions/api/...) → /search etc.
  path = path.replace(/^\/\.netlify\/functions\/api/, '') || '/';
  path = path.replace(/^\/api/, '') || '/';
  if (!path.startsWith('/')) path = '/' + path;

  let body = null;
  if (event.body) {
    try {
      const raw = event.isBase64Encoded
        ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
      body = JSON.parse(raw);
    } catch (e) { body = null; }
  }

  const hdrs = {};
  for (const k of Object.keys(event.headers || {})) hdrs[k.toLowerCase()] = event.headers[k];

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'x-client-id, content-type',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      },
      body: '',
    };
  }

  try {
    const res = await app.route(event.httpMethod, path, event.queryStringParameters || {}, hdrs, body);
    return {
      statusCode: res.status,
      headers: Object.assign({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'x-client-id, content-type',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      }, res.headers || {}),
      body: JSON.stringify(res.body),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'internal error' }),
    };
  }
};

exports.createApp = createApp;
