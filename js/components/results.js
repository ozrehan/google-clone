'use strict';
/* components/results.js — web results: stats, did-you-mean, cards, PAA, related, pager */
window.G = window.G || {};

G.Results = (function(){
  const esc = s => G.dom.esc(s);

  function cardHTML(r, q, i){
    const d = r.doc;
    const color = r.color || G.Engine.favColor(d.site);
    const fav = r.fav || esc(d.site.replace(/^www\./, '').charAt(0).toUpperCase());
    const matchInfo = r.score > 0
      ? '<div class="res-score">relevance ' + r.score.toFixed(0) + ' · matched ' + esc(d.topic) + '</div>' : '';
    return '<div class="result">' +
      '<div class="res-site"><div class="fav" style="background:' + color + '">' + fav + '</div>' +
      '<div><div class="name">' + esc(d.name) + '</div><div class="url">' + esc(d.crumb) + '</div></div></div>' +
      '<a class="res-title" href="#" data-fake="' + esc(d.name) + '">' + G.dom.boldQ(d.title, q) + '</a>' +
      '<div class="res-snip">' + G.dom.boldQ(d.snippet, q) + '</div>' + matchInfo +
      '</div>';
  }

  function pagerHTML(totalPages, cur){
    const n = Math.min(10, Math.max(1, totalPages));
    let h = '<div class="pager">';
    h += '<div class="pg"><span class="gl" style="color:#4285F4">G</span><span class="n"></span></div>';
    for (let i = 1; i <= n; i++){
      const cls = i === cur ? 'pg cur' : 'pg';
      const click = i === cur ? '' : ' data-page="' + i + '"';
      h += '<div class="' + cls + '"' + click + '><span class="gl" style="color:' +
        (i === 1 ? '#EA4335' : '#FBBC05') + '">o</span><span class="n">' + i + '</span></div>';
    }
    h += '<div class="pg"><span class="gl" style="color:#4285F4">g</span><span class="n"></span></div>' +
         '<div class="pg"><span class="gl" style="color:#34A853">l</span><span class="n"></span></div>' +
         '<div class="pg"><span class="gl" style="color:#EA4335">e</span><span class="n"></span></div>';
    return h + '</div>';
  }

  function paaHTML(q, topDocs){
    const items = G.Related.paa(q, topDocs);
    return '<div class="paa"><h2>People also ask</h2>' + items.map((p, i) =>
      '<div class="paa-row" id="paa' + i + '">' +
      '<div class="paa-q" data-paa="' + i + '"><span>' + esc(p.q) + '</span>' +
      '<span class="chev">' + G.dom.icon('chev', 'sm') + '</span></div>' +
      '<div class="paa-a">' + esc(p.a) + '</div></div>').join('') + '</div>';
  }

  function skeletonHTML(perPage){
    let h = '<div class="stats skel-line" style="width:220px"></div>';
    for (let i = 0; i < Math.min(perPage, 6); i++)
      h += '<div class="result skel"><div class="skel-line" style="width:34%"></div>' +
        '<div class="skel-line big" style="width:84%"></div>' +
        '<div class="skel-line" style="width:96%"></div>' +
        '<div class="skel-line" style="width:68%"></div></div>';
    return h;
  }

  async function render(){
    const q = G.store.q;
    const perPage = G.store.settings.perPage;
    // Google-style loading state while the server ranks the query
    G.dom.$('resMain').innerHTML = skeletonHTML(perPage);
    G.dom.$('resSide').innerHTML = '';

    const res = await G.Engine.search(q, G.store.page, perPage);
    G.store.page = res.page;

    const list = res.results;

    let h = '<div class="stats">About ' + G.fmt.num(res.count) + ' results (' + res.secs + ' seconds)</div>';

    if (res.didYouMean){
      h += '<div class="didyoumean">Did you mean: <a data-correct="' + esc(res.didYouMean) + '">' +
        esc(res.didYouMean) + '</a></div>';
    }
    if (res.offline){
      h += '<div class="didyoumean" style="font-size:13px;color:var(--text-4)">Offline mode &mdash; searched the built-in index</div>';
    } else if (res.fallback){
      h += '<div class="didyoumean" style="font-size:13px;color:var(--text-4)">No index matches &mdash; showing generated results for &ldquo;' +
        esc(q) + '&rdquo;</div>';
    }

    h += list.map((r, i) => cardHTML(r, q, i)).join('');
    h += paaHTML(q, res.results);

    const rel = G.Related.searches(q, res.results);
    h += '<div class="related"><h3>Searches related to ' + esc(q) + '</h3><div class="related-grid">' +
      rel.map(r => '<a data-research="' + esc(r) + '">' + G.dom.boldQ(r, q) + '</a>').join('') +
      '</div></div>';
    h += pagerHTML(res.totalPages, res.page);

    G.dom.$('resMain').innerHTML = h;
    G.dom.$('resSide').innerHTML = G.Knowledge.panelHTML(res.knowledge, q);

    // wire interactions (delegation)
    const main = G.dom.$('resMain');
    main.onclick = e => {
      const t = e.target;
      const pg = t.closest('[data-page]');
      if (pg){ G.App.gotoPage(parseInt(pg.dataset.page, 10)); return; }
      const rs = t.closest('[data-research]');
      if (rs){ G.App.doSearch(rs.dataset.research, 'all'); return; }
      const dc = t.closest('[data-correct]');
      if (dc){ G.App.doSearch(dc.dataset.correct, 'all'); return; }
      const pq = t.closest('[data-paa]');
      if (pq){ G.dom.$('paa' + pq.dataset.paa).classList.toggle('open'); return; }
      const fk = t.closest('[data-fake]');
      if (fk){ e.preventDefault(); G.fake(fk.dataset.fake); }
    };
  }

  return { render };
})();
