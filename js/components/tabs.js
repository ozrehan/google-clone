'use strict';
/* components/tabs.js — tab bar + Images / Videos / News / Maps renderers */
window.G = window.G || {};

G.Tabs = (function(){
  const TABS = [
    ['all', 'All', 'search'], ['images', 'Images', 'image'], ['videos', 'Videos', 'video'],
    ['news', 'News', 'news'], ['maps', 'Maps', 'pin'], ['more', 'More', 'chev']
  ];

  function renderBar(){
    G.dom.$('tabs').innerHTML = TABS.map(([id, label, ic]) =>
      '<div class="tab' + (G.store.tab === id ? ' active' : '') + '" data-tab="' + id + '">' +
      G.dom.icon(ic, 'sm') + esc(label) + '</div>').join('');
    G.dom.$('tabs').onclick = e => {
      const t = e.target.closest('[data-tab]');
      if (t) setTab(t.dataset.tab);
    };
  }
  const esc = s => G.dom.esc(s);

  function setTab(id){
    if (id === 'more'){ G.toast('More: Shopping, Books, Flights — demo clone'); return; }
    G.store.tab = id;
    G.store.page = 1;
    renderBar();
    G.App.renderTab();
  }

  /* ---------- images ---------- */
  function renderImages(q){
    const slug = G.fmt.slugify(q);
    const rnd = G.mulberry32(G.hashStr(q + '|img'));
    let h = '<div class="stats">About ' + G.fmt.num(Math.floor(50000 + rnd() * 900000)) +
      ' image results (' + (0.3 + rnd() * 0.4).toFixed(2) + ' seconds)</div><div class="img-grid">';
    for (let i = 0; i < 24; i++){
      const seed = slug + '-' + i;
      h += '<div class="img-card" data-full="https://picsum.photos/seed/' + seed + '/900/600" data-cap="' +
        esc(G.fmt.titleCase(q)) + ' — photo ' + (i + 1) + '">' +
        '<img src="https://picsum.photos/seed/' + seed + '/300/200" alt="' + esc(q) + '" loading="lazy">' +
        '<div class="cap">' + esc(G.fmt.titleCase(q)) + ' — photo ' + (i + 1) + '</div></div>';
    }
    G.dom.$('resMain').innerHTML = h + '</div>';
    G.dom.$('resMain').onclick = e => {
      const c = e.target.closest('.img-card');
      if (!c) return;
      G.dom.$('lightboxImg').src = c.dataset.full;
      G.dom.$('lightboxCap').textContent = c.dataset.cap;
      G.dom.$('imgOverlay').classList.add('show');
    };
  }

  /* ---------- videos ---------- */
  function renderVideos(q){
    const Q = G.fmt.titleCase(q), slug = G.fmt.slugify(q);
    const rnd = G.mulberry32(G.hashStr(q + '|vid'));
    const chans = ['LearnFast', 'The Daily Explain', 'Studio North', 'Deep Dive', 'BrightPath', 'Field Notes'];
    const titles = [Q + ' Explained in 10 Minutes', 'I Tried ' + Q + ' for 30 Days — Here\u2019s What Happened',
      'The Untold Story of ' + Q, Q + ' for Absolute Beginners (Full Course)',
      'Top 7 ' + Q + ' Mistakes to Avoid', 'Why Everyone Is Talking About ' + Q,
      Q + ': Advanced Techniques', 'Live Q&A — Your ' + Q + ' Questions Answered'];
    const ago = ['2 hours ago', '8 hours ago', '1 day ago', '3 days ago', '1 week ago', '2 weeks ago', '1 month ago', '3 months ago'];
    let h = '<div class="stats">About ' + G.fmt.num(Math.floor(20000 + rnd() * 300000)) + ' video results</div>';
    titles.forEach((t, i) => {
      const dur = Math.floor(rnd() * 50) + 3, sec = Math.floor(rnd() * 60);
      const views = rnd() > 0.5 ? (rnd() * 9 + 0.2).toFixed(1) + 'M views' : Math.floor(rnd() * 800 + 20) + 'K views';
      h += '<div class="vid-card" data-fake="Video player">' +
        '<div class="vid-thumb"><img src="https://picsum.photos/seed/' + slug + '-vid' + i + '/440/248" alt="" loading="lazy">' +
        '<span class="vid-play">' + G.dom.icon('play', 'sm') + '</span>' +
        '<span class="vid-dur">' + dur + ':' + String(sec).padStart(2, '0') + '</span></div>' +
        '<div><div class="vid-title">' + G.dom.boldQ(t, q) + '</div>' +
        '<div class="vid-meta">' + chans[i % chans.length] + ' · ' + views + ' · ' + ago[i % ago.length] + '<br>' +
        G.dom.boldQ('A clear, practical look at ' + q + ' — what matters, what doesn\u2019t, and where to go next.', q) +
        '</div></div></div>';
    });
    const main = G.dom.$('resMain');
    main.innerHTML = h;
    main.onclick = e => { const c = e.target.closest('[data-fake]'); if (c) G.fake(c.dataset.fake); };
  }

  /* ---------- news (with topic chips) ---------- */
  const CHIPS = [['top', 'Top stories'], ['tech', 'Tech'], ['science', 'Science'], ['sports', 'Sports'], ['world', 'World']];
  function renderNews(q){
    const chip = G.store.newsChip;
    let h = '<div class="news-chips">' + CHIPS.map(([id, label]) =>
      '<button class="chip' + (chip === id ? ' active' : '') + '" data-chip="' + id + '">' + label + '</button>').join('') + '</div>';
    const items = G.NEWS_INDEX.filter(n => chip === 'top' || n.topic === chip);
    const rnd = G.mulberry32(G.hashStr(q + '|newscount'));
    h += '<div class="stats">About ' + G.fmt.num(Math.floor(8000 + rnd() * 120000)) + ' news results</div>';
    h += items.map(n =>
      '<div class="news-card" data-fake="' + esc(n.source) + '">' +
      '<img class="news-thumb" src="https://picsum.photos/seed/' + n.seed + '/240/160" alt="" loading="lazy">' +
      '<div><div class="news-src">' + esc(n.source) + '<span class="news-time"> · ' + esc(n.time) + '</span></div>' +
      '<a class="res-title" style="font-size:18px" href="#" onclick="return false">' + G.dom.boldQ(n.title, q) + '</a>' +
      '<div class="res-snip">' + G.dom.boldQ(n.snippet, q) + '</div></div></div>').join('');
    const main = G.dom.$('resMain');
    main.innerHTML = h;
    main.onclick = e => {
      const c = e.target.closest('[data-chip]');
      if (c){ G.store.newsChip = c.dataset.chip; renderNews(q); window.scrollTo(0, 0); return; }
      const f = e.target.closest('[data-fake]');
      if (f){ e.preventDefault(); G.fake(f.dataset.fake); }
    };
  }

  /* ---------- maps placeholder ---------- */
  function renderMaps(q){
    G.dom.$('resMain').innerHTML =
      '<div class="stats">Places related to &ldquo;' + esc(q) + '&rdquo;</div>' +
      '<div class="kcard" style="margin:20px 0;max-width:650px"><div class="kcard-body">' +
      '<h2 style="font-size:20px">🗺️ Maps preview</h2>' +
      '<p style="margin-top:8px">This demo clone doesn\u2019t include real map tiles, but a full build would show ' +
      'places matching <b>' + esc(q) + '</b> here — with pins, ratings, and directions — powered by an open ' +
      'map stack like OpenStreetMap + Leaflet.</p></div></div>';
    G.dom.$('resMain').onclick = null;
  }

  return { renderBar, setTab, renderImages, renderVideos, renderNews, renderMaps };
})();
