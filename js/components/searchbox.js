'use strict';
/* components/searchbox.js — search box markup + autocomplete + voice UI */
window.G = window.G || {};

G.Searchbox = (function(){
  const ic = (n, cls) => G.dom.icon(n, cls);

  /** markup for a search box; ids are prefixed so home + results can coexist */
  function html(prefix, opts){
    opts = opts || {};
    return '' +
    '<div class="search-wrap">' +
      '<div class="' + (opts.res ? 'res-box' : 'search-box') + '" id="' + prefix + 'Box">' +
        (opts.res ? '' : ic('search')) +
        '<input id="' + prefix + 'Input" type="text" autocomplete="off" aria-label="Search">' +
        (opts.res ? '<button class="clear-x" id="' + prefix + 'Clear" title="Clear">×</button>' : '') +
        '<button class="icon-btn" title="Search by voice" data-voice="' + prefix + '">' + ic('mic') + '</button>' +
        '<button class="icon-btn" title="Search by image" data-lens="1">' + ic('lens') + '</button>' +
        (opts.res ? '<button class="icon-btn" title="Search" data-go="' + prefix + '">' + ic('search') + '</button>' : '') +
      '</div>' +
      '<div class="suggest" id="' + prefix + 'Suggest"></div>' +
    '</div>';
  }

  let _sugTok = 0;

  function mount(prefix, onSubmit){
    const inp = G.dom.$(prefix + 'Input');
    const box = G.dom.$(prefix + 'Box');
    const dd  = G.dom.$(prefix + 'Suggest');
    const esc = G.dom.esc;

    const show = async () => {
      const my = ++_sugTok;
      const v = inp.value;
      const recents = G.store.recentQueries(v, 4);
      const q = v.trim().toLowerCase();
      // completions now come from the server index (popular queries boost ranking)
      let sugg, trending;
      if (q){
        sugg = await G.Engine.suggest(v);
        trending = false;
      } else {
        sugg = await G.Engine.trending();
        trending = true;
      }
      if (my !== _sugTok) return; // stale keystroke — a newer request won
      if (!recents.length && !sugg.length){ dd.style.display = 'none'; box.classList.remove('open'); return; }
      dd.innerHTML =
        recents.map(r =>
          '<div class="suggest-row recent" data-q="' + esc(r.q) + '">' + ic('clock', 'sm') +
          '<span>' + esc(r.q) + '</span><span class="lbl">' + G.fmt.ago(r.t) + '</span></div>').join('') +
        (trending ? '<div class="suggest-row" style="cursor:default"><span class="lbl" style="margin:0">Trending searches</span></div>' : '') +
        sugg.map(s =>
          '<div class="suggest-row" data-q="' + esc(s) + '">' + ic('search', 'sm') +
          '<span>' + G.dom.boldQ(s, v) + '</span></div>').join('');
      dd.style.display = 'block';
      box.classList.add('open');
      dd.querySelectorAll('.suggest-row[data-q]').forEach(row => {
        row.addEventListener('mousedown', e => { e.preventDefault(); onSubmit(row.dataset.q); });
      });
    };
    const hide = () => setTimeout(() => { dd.style.display = 'none'; box.classList.remove('open'); }, 150);

    inp.addEventListener('focus', show);
    inp.addEventListener('input', show);
    inp.addEventListener('blur', hide);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') onSubmit(inp.value); });

    const clearBtn = G.dom.$(prefix + 'Clear');
    if (clearBtn) clearBtn.addEventListener('click', () => { inp.value = ''; inp.focus(); });

    // voice + lens + go buttons (event delegation within this box)
    box.addEventListener('click', e => {
      const v = e.target.closest('[data-voice]');
      const l = e.target.closest('[data-lens]');
      const g = e.target.closest('[data-go]');
      if (v){ voiceUI(prefix, onSubmit); }
      else if (l){ G.toast('Google Lens is not available in this demo'); }
      else if (g){ onSubmit(inp.value); }
    });
  }

  function shake(prefix){
    const box = G.dom.$(prefix + 'Box');
    box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
  }

  /** fake voice-search UI: pulsing mic, "hears" a demo phrase */
  function voiceUI(prefix, onSubmit){
    const ov = G.dom.$('voiceOverlay');
    const heard = G.dom.$('voiceHeard');
    heard.textContent = '';
    ov.classList.add('show');
    const demo = ['best pizza near me', 'python tutorial', 'japan travel guide'];
    const phrase = demo[G.hashStr(String(Date.now())) % demo.length];
    let i = 0;
    const timer = setInterval(() => {
      if (!ov.classList.contains('show')){ clearInterval(timer); return; }
      heard.textContent = phrase.slice(0, ++i);
      if (i >= phrase.length){
        clearInterval(timer);
        setTimeout(() => {
          ov.classList.remove('show');
          onSubmit(phrase);
        }, 600);
      }
    }, 55);
  }

  return { html, mount, shake, voiceUI };
})();
