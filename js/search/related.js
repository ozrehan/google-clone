'use strict';
/* search/related.js — People Also Ask + related searches, driven by the index */
window.G = window.G || {};

G.Related = (function(){
  const TEMPLATES = [
    { q: t => 'What is ' + t + '?',
      a: t => t + ' is a widely searched topic covering guides, tools, and community resources. Most people look it up to understand what it is, how it works, and how to get started — this page collects the best explanations in one place.' },
    { q: t => 'How do I get started with ' + t + '?',
      a: t => 'Start with a beginner\u2019s guide (several are linked above), then try a small hands-on project. Most learners go from zero to comfortable with ' + t + ' in a few focused weeks.' },
    { q: t => 'Is ' + t + ' free?',
      a: t => 'Many ' + t + ' resources are free — community tutorials, documentation, and open-source tools. Some advanced products offer paid tiers; the comparison guides above break down what you get at each price point.' },
    { q: t => 'What are the best ' + t + ' resources?',
      a: t => 'The top results on this page are a strong shortlist: official documentation for accuracy, community guides for practical tips, and video courses if you prefer learning by watching.' }
  ];

  /** PAA: prefer questions answerable from actual top docs */
  function paa(q, topDocs){
    const out = TEMPLATES.map(t => ({ q: t.q(q), a: t.a(q) }));
    if (topDocs && topDocs.length){
      const d = topDocs[0].doc;
      out[1] = {
        q: 'Where can I learn ' + q + ' properly?',
        a: 'Start with \u201C' + d.title + '\u201D (' + d.site + ') — ' +
           d.snippet.split('.')[0] + '. Then work through one more guide from the results above.'
      };
    }
    return out;
  }

  /** related searches: blend query templates with keywords from top docs */
  function searches(q, topDocs){
    const Q = G.fmt.titleCase(q);
    const rel = [Q + ' tutorial', 'what is ' + q, Q + ' for beginners', 'best ' + q + ' tools'];
    if (topDocs){
      for (const r of topDocs.slice(0, 4)){
        for (const k of r.doc.keywords.slice(0, 3)){
          const cand = q + ' ' + k;
          if (!rel.includes(cand) && cand.toLowerCase() !== q.toLowerCase()) rel.push(cand);
          if (rel.length >= 8) break;
        }
        if (rel.length >= 8) break;
      }
    }
    return rel.slice(0, 8);
  }

  return { paa, searches };
})();
