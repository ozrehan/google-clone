'use strict';
/* smoke.test.js — end-to-end: frontend G.Engine + G.Api talking to the REAL
   backend app (createApp + in-memory store) through a mocked fetch. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');
const { createApp } = require('./api.js');

const ROOT = __dirname + '/../..';
const FILES = [
  'js/utils/format.js', 'js/utils/dom.js', 'js/api.js',
  'js/data/webindex.js', 'js/data/suggestions.js', 'js/data/news.js',
  'js/store.js', 'js/search/engine-local.js', 'js/search/engine.js',
  'js/search/knowledge.js', 'js/search/related.js',
];

class MemStore {
  constructor() { this.m = new Map(); }
  async get(k, o) { const v = this.m.get(k); return v === undefined ? null : (o && o.type === 'json' ? JSON.parse(v) : v); }
  async setJSON(k, v) { this.m.set(k, JSON.stringify(v)); }
  async delete(k) { this.m.delete(k); }
}

function makeSandbox(fetchImpl) {
  const localStore = {};
  const sandbox = {
    console,
    URL, URLSearchParams,
    localStorage: {
      getItem: k => (k in localStore ? localStore[k] : null),
      setItem: (k, v) => { localStore[k] = String(v); },
    },
    fetch: fetchImpl,
    document: { getElementById: () => { throw new Error('no DOM in smoke test'); } },
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  for (const f of FILES) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sandbox, { filename: f });
  }
  return sandbox;
}

function apiFetch(app) {
  return async (url, opts) => {
    const u = new URL(url, 'http://x');
    const query = {};
    for (const [k, v] of u.searchParams) query[k] = v;
    const res = await app.route(opts.method || 'GET', u.pathname.replace(/^\/api/, '') || '/',
      query, { 'x-client-id': (opts.headers || {})['x-client-id'] },
      opts.body ? JSON.parse(opts.body) : null);
    return { ok: res.status < 400, status: res.status, json: async () => res.body };
  };
}

async function main() {
  let n = 0;
  const ok = (name, cond) => { n++; assert(cond, 'FAIL: ' + name); console.log('ok -', name); };

  // ---- online: frontend → real backend ----
  const app = createApp(new MemStore());
  const G = makeSandbox(apiFetch(app)).G;

  let r = await G.Engine.search('python', 1, 10);
  ok('e2e search works', r.results.length === 10 && r.total > 10);
  ok('e2e top doc is python', /python/i.test(r.results[0].doc.title));
  ok('e2e knowledge from server', r.knowledge && r.knowledge.title === 'Python');
  ok('e2e not offline', r.offline === false);

  r = await G.Engine.search('pythno', 1, 10);
  ok('e2e didYouMean', r.didYouMean === 'python');

  const s = await G.Engine.suggest('rea');
  ok('e2e suggest', s.some(x => x.startsWith('react')));

  const t = await G.Engine.trending();
  ok('e2e trending', t.length === 8);

  // related searches still work on normalized results
  r = await G.Engine.search('cricket', 1, 10);
  const rel = G.Related.searches('cricket', r.results);
  ok('e2e related', rel.length > 0 && rel[0].length > 0);
  const paa = G.Related.paa('cricket', r.results);
  ok('e2e paa', paa.length === 4 && paa[0].q.includes('cricket'));

  // knowledge panel HTML renders from server entity
  const pz = await G.Engine.search('pizza', 1, 1);
  const html = G.Knowledge.panelHTML(pz.knowledge, 'pizza');
  ok('e2e knowledge html', html.includes('kcard') && html.includes('Pizza'));

  // images tab normalization
  const img = await G.Api.search('japan', { tab: 'images', start: 0, perPage: 5 });
  ok('e2e images', img.results.every(x => x.img && x.img.thumb.includes('picsum.photos')));

  // history round-trip through frontend store
  G.store.pushHistory('smoke test query');
  await new Promise(res2 => setTimeout(res2, 50));
  const h = await G.Api.history();
  ok('e2e history persisted server-side', h.history.some(x => x.q === 'smoke test query'));

  // ---- offline: fetch throws → EngineLocal fallback ----
  const G2 = makeSandbox(async () => { throw new Error('network down'); }).G;
  const r2 = await G2.Engine.search('python', 1, 10);
  ok('offline fallback works', r2.offline === true && r2.results.length > 0);
  ok('offline top doc python', /python/i.test(r2.results[0].doc.title));
  const s2 = await G2.Engine.suggest('pyt');
  ok('offline suggest works', s2.includes('python tutorial'));
  const t2 = await G2.Engine.trending();
  ok('offline trending works', t2.length === 6);

  console.log('\n' + n + ' smoke tests passed');
}

main().then(() => process.exit(0), e => { console.error(e.message); process.exit(1); });
