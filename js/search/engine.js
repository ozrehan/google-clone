'use strict';
/* search/engine.js — real ranking search over G.WEB_INDEX.
   tokenize → score docs by keyword/title/snippet overlap → ranked results.
   "Did you mean" via Levenshtein edit distance against the index vocabulary. */
window.G = window.G || {};

G.Engine = (function(){
  const STOP = new Set(['the','a','an','of','to','in','is','are','was','were','what','how','why',
    'when','where','which','for','on','and','or','vs','with','by','at','as','it','its','be','do',
    'does','did','can','could','should','would','this','that','these','those','i','my','me','we']);

  function tokenize(q){
    return String(q).toLowerCase()
      .replace(/[^a-z0-9+#.\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1 && !STOP.has(t));
  }

  function wholeWord(hay, tok){
    return new RegExp('\\b' + G.dom.escRe(tok) + '\\b').test(hay);
  }

  /** vocabulary = every keyword + topic + title word in the index */
  let _vocab = null;
  function vocabulary(){
    if (_vocab) return _vocab;
    _vocab = new Set();
    for (const d of G.WEB_INDEX){
      _vocab.add(d.topic);
      for (const k of d.keywords) _vocab.add(k);
      for (const w of d.title.toLowerCase().split(/[^a-z0-9+#]+/))
        if (w.length > 2) _vocab.add(w);
    }
    return _vocab;
  }

  function levenshtein(a, b){
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    const dp = new Array(n + 1);
    for (let j = 0; j <= n; j++) dp[j] = j;
    for (let i = 1; i <= m; i++){
      let prev = dp[0]; dp[0] = i;
      for (let j = 1; j <= n; j++){
        const t = dp[j];
        dp[j] = Math.min(dp[j] + 1, dp[j-1] + 1, prev + (a[i-1] === b[j-1] ? 0 : 1));
        prev = t;
      }
    }
    return dp[n];
  }

  /** closest vocabulary word within edit distance 2 (for tokens len>=4) */
  function correctToken(tok){
    if (vocabulary().has(tok) || tok.length < 4) return null;
    let best = null, bestD = 3;
    for (const w of vocabulary()){
      if (Math.abs(w.length - tok.length) > 2) continue;
      const d = levenshtein(tok, w);
      if (d < bestD){ bestD = d; best = w; }
      if (d === 1) break;
    }
    return best;
  }

  function didYouMean(q){
    const toks = String(q).toLowerCase().split(/\s+/);
    let changed = false;
    const fixed = toks.map(t => {
      const c = correctToken(t);
      if (c){ changed = true; return c; }
      return t;
    });
    return changed ? fixed.join(' ') : null;
  }

  function scoreDoc(d, toks){
    const title = d.title.toLowerCase();
    const snip = d.snippet.toLowerCase();
    const site = (d.site + ' ' + d.url).toLowerCase();
    let s = 0;
    for (const t of toks){
      if (wholeWord(title, t)) s += 7;
      else if (title.includes(t)) s += 4;
      if (d.keywords.includes(t)) s += 5;
      else if (d.keywords.some(k => k.includes(t) || t.includes(k))) s += 2;
      if (wholeWord(snip, t)) s += 2;
      if (d.topic.includes(t) || t.includes(d.topic)) s += 1;
      if (site.includes(t)) s += 1;
    }
    // slight preference for docs matching MORE distinct tokens
    return s;
  }

  function search(q, page, perPage){
    const toks = tokenize(q);
    const s = G.store.settings;
    let pool = G.WEB_INDEX;
    if (s.safeSearch) pool = pool.filter(d => !d.mature);

    let ranked = [];
    if (toks.length){
      ranked = pool
        .map(d => ({ doc: d, score: scoreDoc(d, toks) }))
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score || G.hashStr(a.doc.id) - G.hashStr(b.doc.id));
    }

    const rnd = G.mulberry32(G.hashStr(q + '|stats'));
    const totalPages = Math.max(1, Math.ceil(ranked.length / perPage));
    const p = Math.min(Math.max(1, page), totalPages);
    const slice = ranked.slice((p - 1) * perPage, p * perPage);

    // fake-but-deterministic result count & timing
    const count = ranked.length
      ? ranked.length * (42000 + Math.floor(rnd() * 90000)) + Math.floor(rnd() * 999)
      : Math.floor(180000 + rnd() * 4800000);
    const secs = (0.21 + rnd() * 0.5).toFixed(2);

    return {
      results: slice, total: ranked.length, totalPages, page: p,
      count, secs, didYouMean: didYouMean(q),
      fallback: ranked.length === 0
    };
  }

  /* ---------- legacy seeded generator: fallback when the index has no match ---------- */
  const FAV_COLORS = ['#4285F4','#EA4335','#FBBC05','#34A853','#8e24aa','#0097a7','#ef6c00','#5c6bc0'];
  function fallbackResults(q, page, perPage){
    const Q = G.fmt.titleCase(q), slug = G.fmt.slugify(q);
    const rnd = G.mulberry32(G.hashStr(q + '|page' + page));
    const pick = a => a[Math.floor(rnd() * a.length)];
    const domains = [
      'www.' + slug + 'guide.com', slug + 'hub.io', 'docs.' + slug + 'dev',
      'blog.' + slug + 'central.com', 'learn' + slug + '.org', 'www.howto' + slug + '.net',
      slug + 'insider.com', 'community.' + slug + 'talk.com', slug + '.stacktips.dev',
      'www.the' + slug + 'post.com', 'academy.' + slug + 'lab.io', 'news.' + slug + 'wire.com'
    ];
    for (let i = domains.length - 1; i > 0; i--){
      const j = Math.floor(rnd() * (i + 1)); [domains[i], domains[j]] = [domains[j], domains[i]];
    }
    const paths = ['› guides › ' + slug + '-basics','› ' + slug + ' › getting-started',
      '› blog › ' + slug + '-explained','› docs › ' + slug + '-reference',
      '› learn › ' + slug + '-course','› ' + slug + ' › faq'];
    const titles = [
      Q + ' — The Complete Beginner\u2019s Guide (2026)',
      'What Is ' + Q + '? Everything You Need to Know',
      '10 Best ' + Q + ' Resources, Tools & Tutorials',
      Q + ' Explained: A Visual Introduction for Newcomers',
      'How to Get Started with ' + Q + ' in 30 Minutes',
      Q + ' vs. the Alternatives: An Honest Comparison',
      'The Official ' + Q + ' Documentation & API Reference',
      '/r/' + slug + ' — ' + Q + ' Community, Tips & Discussion',
      Q + ': 25 Expert Tips You Should Know in 2026',
      'Understanding ' + Q + ' — Concepts, Examples & Use Cases',
      Q + ' News, Trends & In-Depth Analysis',
      'Free ' + Q + ' Course: From Zero to Confident'
    ];
    const snippets = [
      'From in-depth tutorials to official documentation, this guide covers everything about ' + q + ': what it is, how it works, and how to get started today. Includes worked examples, FAQs, and tips from experienced practitioners.',
      'Looking for ' + q + '? We compare the top-rated tools, resources, and services for ' + q + ' in 2026 \u2014 with real user reviews, pricing breakdowns, and a checklist to help you choose with confidence.',
      'Learn ' + q + ' step by step with interactive lessons and real-world projects. Join 120,000+ learners who started with this free ' + q + ' course and finished with a portfolio-ready skill set.',
      'What exactly is ' + q + ', and why is everyone talking about it? This plain-English explainer breaks down ' + q + ' into simple concepts, with diagrams and everyday analogies \u2014 no prior knowledge required.',
      'The community hub for ' + q + ': ask questions, share your work, and get feedback from thousands of ' + q + ' enthusiasts. Daily threads cover troubleshooting, best practices, and new developments.',
      'Our editors tested every major ' + q + ' option on the market. Here\u2019s the honest verdict on which ' + q + ' solutions are worth your time \u2014 and which ones to skip.',
      'The official reference for ' + q + ', maintained by the core team. Browse the full ' + q + ' documentation, API reference, migration guides, and release notes in one searchable place.',
      'Stay current with ' + q + ': breaking news, expert analysis, and long-form features from our ' + q + ' desk. Updated daily by reporters who cover ' + q + ' full-time.',
      'Struggling with ' + q + '? These 25 field-tested tips will save you hours. Covers common mistakes, hidden features, and pro workflows that most ' + q + ' beginners miss.',
      'A hands-on walkthrough of ' + q + ' from first principles. You\u2019ll build a working example, understand the key ideas behind ' + q + ', and know exactly what to learn next.',
      'Downloadable ' + q + ' cheat sheet, templates, and checklists. Everything in this ' + q + ' starter pack is free and designed to take you from curious to capable fast.',
      'Independent, ad-free reviews of ' + q + ' products and services. Our methodology for evaluating ' + q + ' is published openly so you can trust every score.'
    ];
    const tIdx = titles.map((_, i) => i), sIdx = snippets.map((_, i) => i);
    for (let i = tIdx.length - 1; i > 0; i--){
      const j = Math.floor(rnd() * (i + 1));
      [tIdx[i], tIdx[j]] = [tIdx[j], tIdx[i]];
      [sIdx[i], sIdx[j]] = [sIdx[j], sIdx[i]];
    }
    const out = [];
    for (let i = 0; i < perPage; i++){
      const d = domains[i % domains.length];
      const name = d.replace(/^www\./,'').split('.')[0].replace(/-/g,' ')
        .replace(/\b\w/g, c => c.toUpperCase());
      out.push({
        doc: {
          id: 'fb-' + i, topic: 'general', title: titles[tIdx[i % tIdx.length]],
          site: d, name, url: 'https://' + d, crumb: 'https://' + d + ' ' + pick(paths),
          snippet: snippets[sIdx[i % sIdx.length]], keywords: []
        },
        score: 0,
        color: FAV_COLORS[G.hashStr(d) % FAV_COLORS.length],
        fav: d.replace(/^www\./,'').charAt(0).toUpperCase()
      });
    }
    return out;
  }

  function favColor(site){
    return FAV_COLORS[G.hashStr(site) % FAV_COLORS.length];
  }

  return { tokenize, search, didYouMean, fallbackResults, favColor, vocabulary };
})();
