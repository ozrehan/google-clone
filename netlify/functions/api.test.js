'use strict';
/* api.test.js — pure node, in-memory blob store. Must exit 0. */
const assert = require('assert');
const { createApp } = require('./api');

class MemStore {
  constructor() { this.m = new Map(); }
  async get(k, opts) {
    const v = this.m.get(k);
    if (v === undefined) return null;
    return opts && opts.type === 'json' ? JSON.parse(v) : v;
  }
  async setJSON(k, v) { this.m.set(k, JSON.stringify(v)); }
  async delete(k) { this.m.delete(k); }
}

const HEADERS = { 'x-client-id': 'test-client-1' };

async function main() {
  const app = createApp(new MemStore());
  let n = 0;
  const ok = (name, cond) => { n++; assert(cond, 'FAIL: ' + name); console.log('ok -', name); };

  // 1. search "python" → python docs ranked first
  let r = await app.route('GET', '/search', { q: 'python', tab: 'web', perPage: '5' }, {}, null);
  ok('search 200', r.status === 200);
  ok('python results exist', r.body.total > 5);
  const top = r.body.results[0];
  ok('python ranked first', /python/i.test(top.title) || top.keywords.includes('python'));
  ok('result has url/site/snippet', !!(top.url && top.site && top.snippet));
  ok('count + secs present', r.body.count > 0 && !!r.body.secs);

  // 2. typo "pythno" → didYouMean "python"
  r = await app.route('GET', '/search', { q: 'pythno' }, {}, null);
  ok('typo didYouMean=python', r.body.didYouMean === 'python');

  // 3. suggest "rea" → react...
  r = await app.route('GET', '/suggest', { q: 'rea' }, {}, null);
  ok('suggest 200', r.status === 200);
  ok('suggest rea → react', r.body.suggestions.some(s => s.startsWith('react')));

  // 4. knowledge for "leonardo da vinci"
  r = await app.route('GET', '/search', { q: 'leonardo da vinci' }, {}, null);
  ok('knowledge present', !!r.body.knowledge);
  ok('knowledge title', r.body.knowledge.title === 'Leonardo da Vinci');
  ok('knowledge facts', Array.isArray(r.body.knowledge.facts) && r.body.knowledge.facts.length > 0);

  // 5. history post + get
  r = await app.route('POST', '/history', {}, HEADERS, { q: 'cricket world cup' });
  ok('history post ok', r.status === 200 && r.body.ok);
  r = await app.route('POST', '/history', {}, HEADERS, { q: 'python tutorial' });
  ok('history post 2 ok', r.body.ok);
  r = await app.route('GET', '/history', {}, HEADERS, null);
  ok('history get', r.status === 200 && r.body.history.length === 2);
  ok('history newest first', r.body.history[0].q === 'python tutorial');
  ok('history has timestamps', typeof r.body.history[0].t === 'number');

  // 6. history isolation between clients
  const r2 = await app.route('GET', '/history', {}, { 'x-client-id': 'other-client' }, null);
  ok('history per-client', r2.body.history.length === 0);

  // 7. history delete
  r = await app.route('DELETE', '/history', {}, HEADERS, null);
  ok('history delete ok', r.body.ok);
  r = await app.route('GET', '/history', {}, HEADERS, null);
  ok('history empty after delete', r.body.history.length === 0);

  // 8. empty query → 400
  r = await app.route('GET', '/search', { q: '   ' }, {}, null);
  ok('empty query 400', r.status === 400);

  // 9. images tab → picsum thumbnails
  r = await app.route('GET', '/search', { q: 'japan', tab: 'images', perPage: '4' }, {}, null);
  ok('images 200', r.status === 200);
  ok('images have img', r.body.results.length > 0 &&
    r.body.results.every(x => x.img && x.img.thumb.includes('picsum.photos')));

  // 10. news tab → news docs
  r = await app.route('GET', '/search', { q: 'ai', tab: 'news', perPage: '6' }, {}, null);
  ok('news 200', r.status === 200);
  ok('news results', r.body.results.length > 0 && r.body.results.every(x => x.source && x.time));

  // 11. trending
  r = await app.route('GET', '/trending', {}, {}, null);
  ok('trending 200', r.status === 200 && r.body.trending.length === 8);

  // 12. suggest empty → trending
  r = await app.route('GET', '/suggest', { q: '' }, {}, null);
  ok('suggest empty → trending', r.body.suggestions.length === 8);

  // 13. 404 unknown route
  r = await app.route('GET', '/nope', {}, {}, null);
  ok('404', r.status === 404);

  // 14. pagination
  r = await app.route('GET', '/search', { q: 'python', perPage: '3', start: '3' }, {}, null);
  ok('pagination page 2', r.body.page === 2 && r.body.results.length === 3);

  console.log('\n' + n + ' tests passed');
}

main().then(() => process.exit(0), e => { console.error(e.message); process.exit(1); });
