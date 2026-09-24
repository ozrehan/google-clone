'use strict';
/* components/lucky.js — "I'm Feeling Lucky" overlay panel.
   Now backed by the real index: fetches the top result and offers it
   as the destination ("lucky = first result redirect"). */
window.G = window.G || {};

G.Lucky = {
  async feeling(q){
    q = (q || '').trim();
    if (!q){ G.Searchbox.shake('home'); return; }

    let top = null, offline = false;
    try {
      const res = await G.Engine.search(q, 1, 1);
      offline = !!res.offline;
      if (res.results.length) top = res.results[0].doc;
    } catch (e) { /* fall through to playful fallback */ }

    let dest;
    if (top){
      dest = '<b>' + G.dom.esc(top.site) + '</b><br>' + G.dom.esc(top.title) +
        '<div style="margin-top:10px"><a class="btn" href="' + G.dom.esc(top.url) +
        '" target="_blank" rel="noopener">Take me there \u2197</a></div>' +
        (offline ? '<div style="font-size:12px;color:var(--text-4);margin-top:8px">offline mode \u2014 from the built-in index</div>' : '');
    } else {
      const rnd = G.mulberry32(G.hashStr('lucky|' + q));
      const slug = G.fmt.slugify(q);
      const dests = [
        '<b>https://www.' + slug + 'guide.com/' + slug + '-basics</b><br>The internet\u2019s friendliest ' + G.dom.esc(q) + ' guide \u2014 straight to the good part, no scrolling required.',
        '<b>https://' + slug + 'hub.io</b><br>The community wiki for ' + G.dom.esc(q) + '. 4,096 articles and counting. You\u2019ll fit right in.',
        '<b>https://docs.' + slug + 'dev</b><br>Official ' + G.dom.esc(q) + ' documentation. You look like someone who reads the manual. Respect.',
        '<b>https://www.howto' + slug + '.net</b><br>A 30-minute interactive ' + G.dom.esc(q) + ' crash course. Lucky you \u2014 it\u2019s free today.'
      ];
      dest = dests[Math.floor(rnd() * dests.length)];
    }

    G.dom.$('luckyPanel').innerHTML =
      '<div class="clover">🍀</div><h2>You\u2019re feeling lucky!</h2>' +
      '<p>We skipped the results page and took you straight to the top result for</p>' +
      '<p style="font-size:18px;color:var(--text)"><b>\u201C' + G.dom.esc(q) + '\u201D</b></p>' +
      '<div class="dest">' + dest + '</div>' +
      '<button class="btn" id="luckyGo">Show me the results anyway</button>' +
      '<div style="margin-top:10px"><a href="#" id="luckyBack" style="font-size:13px">Take me back</a></div>';
    G.dom.$('luckyOverlay').classList.add('show');
    G.dom.$('luckyGo').addEventListener('click', () => {
      G.dom.$('luckyOverlay').classList.remove('show');
      G.App.doSearch(q, 'all');
    });
    G.dom.$('luckyBack').addEventListener('click', e => {
      e.preventDefault();
      G.dom.$('luckyOverlay').classList.remove('show');
    });
  }
};
