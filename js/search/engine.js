'use strict';
/* search/engine.js — API-backed search. Same role as before, but queries now
   hit the real server index (Netlify Function) instead of the local array.
   Falls back to G.EngineLocal (the original client-side engine) when the
   backend is unreachable (e.g. file://), so the demo never breaks. */
window.G = window.G || {};

G.Engine = (function(){
  const FAV_COLORS = ['#4285F4','#EA4335','#FBBC05','#34A853','#8e24aa','#0097a7','#ef6c00','#5c6bc0'];
  function favColor(site){
    return FAV_COLORS[G.hashStr(site) % FAV_COLORS.length];
  }

  /** normalize API doc → the {doc, score} shape components already render */
  function normalize(apiRes){
    const results = (apiRes.results || []).map(r => ({
      doc: {
        id: r.id, topic: r.topic, title: r.title, site: r.site, name: r.name,
        url: r.url, crumb: r.crumb, snippet: r.snippet, keywords: r.keywords || [],
        img: r.img || null, source: r.source || null, time: r.time || null, seed: r.seed || null,
      },
      score: r.score || 0,
    }));
    return {
      results, total: apiRes.total, totalPages: apiRes.totalPages, page: apiRes.page,
      count: apiRes.count, secs: apiRes.secs, didYouMean: apiRes.didYouMean || null,
      knowledge: apiRes.knowledge || null, fallback: false, offline: false,
    };
  }

  function localSearch(q, page, perPage){
    const r = G.EngineLocal.search(q, page, perPage);
    return {
      results: r.results, total: r.total, totalPages: r.totalPages, page: r.page,
      count: r.count, secs: r.secs, didYouMean: r.didYouMean,
      knowledge: (G.Knowledge && G.Knowledge.lookup(q)) || null,
      fallback: r.fallback, offline: true,
    };
  }

  /** search(q, page, perPage, opts{ tab, chip }) → Promise<result> */
  async function search(q, page, perPage, opts){
    opts = opts || {};
    page = page || 1; perPage = perPage || 10;
    try {
      const api = await G.Api.search(q, {
        tab: opts.tab || 'web',
        start: (page - 1) * perPage,
        perPage: perPage,
        chip: opts.chip,
      });
      return normalize(api);
    } catch (e) {
      return localSearch(q, page, perPage);
    }
  }

  /** suggest(prefix) → Promise<[strings]> */
  async function suggest(q){
    try {
      const r = await G.Api.suggest(q);
      return r.suggestions || [];
    } catch (e) {
      const p = String(q || '').trim().toLowerCase();
      if (!p) return (G.SUGGESTIONS || []).slice(0, 6);
      let s = (G.SUGGESTIONS || []).filter(x => x.startsWith(p) && x !== p).slice(0, 6);
      if (!s.includes(p)) s.unshift(p);
      return s.slice(0, 7);
    }
  }

  /** trending() → Promise<[strings]> */
  async function trending(){
    try {
      const r = await G.Api.trending();
      return r.trending || [];
    } catch (e) {
      return (G.SUGGESTIONS || []).slice(0, 6);
    }
  }

  return { search, suggest, trending, favColor };
})();
