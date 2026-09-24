'use strict';
/* rank.js — server-side ranking: tokenize → score → ranked results,
   typo-tolerant "did you mean", prefix suggestions, knowledge lookup. */

const { DOCS, ENTITIES, SUGGESTIONS, TRENDING } = require('./index-data');

const STOP = new Set(('the a an of to in is are was were what how why when where which for ' +
  'on and or vs with by at as it its be do does did can could should would this that ' +
  'these those i my me we you your he she they them his her their our us our so if not ' +
  'no yes into out over under than then there here has have had will shall may might ' +
  'must very more most other some such only own same too').split(' '));

function tokenize(q) {
  return String(q).toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOP.has(t));
}

/* FNV-1a — deterministic pseudo-random per string (stable counts/times) */
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

let _vocab = null;
function vocabulary() {
  if (_vocab) return _vocab;
  _vocab = new Set();
  for (const d of DOCS) {
    _vocab.add(d.topic);
    for (const k of d.keywords) _vocab.add(k);
    for (const w of d.title.toLowerCase().split(/[^a-z0-9+#]+/))
      if (w.length > 2) _vocab.add(w);
  }
  return _vocab;
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  const dp = new Array(n + 1);
  for (let j = 0; j <= n; j++) dp[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = dp[0]; dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const t = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = t;
    }
  }
  return dp[n];
}

function correctToken(tok) {
  const v = vocabulary();
  if (v.has(tok) || tok.length < 4) return null;
  let best = null, bestD = 3;
  for (const w of v) {
    if (Math.abs(w.length - tok.length) > 2) continue;
    const d = levenshtein(tok, w);
    if (d < bestD) { bestD = d; best = w; }
    if (d === 1) break;
  }
  return best;
}

function didYouMean(q) {
  const toks = String(q).toLowerCase().split(/\s+/);
  let changed = false;
  const fixed = toks.map(t => { const c = correctToken(t); if (c) { changed = true; return c; } return t; });
  return changed ? fixed.join(' ') : null;
}

/* score = title matches x3 + keyword x2 + snippet x1 + site bonus */
function scoreDoc(d, toks) {
  const title = d.title.toLowerCase();
  const snip = d.snippet.toLowerCase();
  const site = (d.site + ' ' + d.url).toLowerCase();
  let s = 0;
  for (const t of toks) {
    if (title.includes(t)) s += 3;
    if (d.keywords.includes(t)) s += 2;
    else if (d.keywords.some(k => k.includes(t) || t.includes(k))) s += 1;
    if (snip.includes(t)) s += 1;
    if (site.includes(t)) s += 1;
  }
  return s;
}

function lookupKnowledge(q) {
  const key = String(q).toLowerCase().trim();
  if (ENTITIES[key]) return ENTITIES[key];
  for (const k of Object.keys(ENTITIES)) {
    if (key.includes(k) || k.includes(key)) return ENTITIES[k];
  }
  return null;
}

function search(q, opts) {
  opts = opts || {};
  const tab = opts.tab || 'web';
  const start = Math.max(0, parseInt(opts.start, 10) || 0);
  const perPage = Math.min(50, Math.max(1, parseInt(opts.perPage, 10) || 10));
  const toks = tokenize(q);

  let pool = DOCS;
  if (tab === 'news') {
    pool = pool.filter(d => d.type === 'news');
    if (opts.topic && opts.topic !== 'top') pool = pool.filter(d => d.topic === opts.topic);
  } else {
    pool = pool.filter(d => d.type === 'web');
  }

  let ranked = [];
  if (toks.length) {
    ranked = pool
      .map(d => ({ doc: d, score: scoreDoc(d, toks) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score || hashStr(a.doc.id) - hashStr(b.doc.id));
  }

  const total = ranked.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(totalPages, Math.floor(start / perPage) + 1);
  const slice = ranked.slice(start, start + perPage);

  const rnd = mulberry32(hashStr(q + '|stats'));
  const count = total
    ? total * (42000 + Math.floor(rnd() * 90000)) + Math.floor(rnd() * 999)
    : Math.floor(180000 + rnd() * 4800000);
  const secs = (0.21 + rnd() * 0.5).toFixed(2);

  const results = slice.map(r => {
    const d = r.doc;
    const out = {
      id: d.id, title: d.title, url: d.url, site: d.site, name: d.name,
      crumb: d.crumb, snippet: d.snippet, topic: d.topic,
      keywords: d.keywords, score: r.score,
    };
    if (d.type === 'news') { out.source = d.name; out.time = agoLabel(d.id); out.seed = d.imgSeed; }
    if (tab === 'images') {
      out.img = {
        thumb: 'https://picsum.photos/seed/' + d.imgSeed + '/300/200',
        full: 'https://picsum.photos/seed/' + d.imgSeed + '/900/600',
        cap: d.title,
      };
    }
    return out;
  });

  return {
    results, total, totalPages, page, count, secs,
    didYouMean: didYouMean(q),
    knowledge: tab === 'web' ? lookupKnowledge(q) : null,
  };
}

/* deterministic "x hours ago" label for news docs */
function agoLabel(id) {
  const h = hashStr(id + '|ago');
  const hours = ['32 minutes ago', '1 hour ago', '3 hours ago', '5 hours ago', '8 hours ago',
    '11 hours ago', '14 hours ago', '1 day ago', '2 days ago'][h % 9];
  return hours;
}

/* up to 8 completions for a prefix; empty prefix → trending */
function suggest(prefix, popular) {
  const q = String(prefix || '').trim().toLowerCase();
  if (!q) return TRENDING.slice(0, 8);
  const out = [];
  const seen = new Set();
  const push = s => { if (!seen.has(s) && s !== q) { seen.add(s); out.push(s); } };
  // popular (recent global) queries first
  for (const p of (popular || [])) { if (p.toLowerCase().startsWith(q)) push(p); if (out.length >= 8) break; }
  for (const s of SUGGESTIONS) { if (s.startsWith(q)) push(s); if (out.length >= 8) break; }
  // word-boundary fallback: matches containing the prefix
  if (out.length < 8) {
    for (const s of SUGGESTIONS) { if (s.includes(q)) push(s); if (out.length >= 8) break; }
  }
  if (!out.includes(q)) out.unshift(q);
  return out.slice(0, 8);
}

module.exports = { tokenize, search, suggest, didYouMean, lookupKnowledge, vocabulary, TRENDING, DOCS };
