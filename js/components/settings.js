'use strict';
/* components/settings.js — search settings page with working preferences */
window.G = window.G || {};

G.Settings = {
  render(){
    const s = G.store.settings;
    const pills = [5, 10, 15, 20].map(n =>
      '<button class="radio-pill' + (s.perPage === n ? ' active' : '') + '" data-perpage="' + n + '">' + n + '</button>').join('');
    G.dom.$('settingsView').innerHTML =
    '<div class="page-view"><div class="page-head">' +
      '<button class="icon-btn" id="setBack" title="Back">' + G.dom.icon('arrow', 'sm') + '</button>' +
      '<h1>Search settings</h1></div>' +
    '<div class="page-body">' +
      '<div class="set-row"><div><div class="t">SafeSearch</div>' +
        '<div class="d">Filter explicit results. Applies to the local search index.</div></div>' +
        '<label class="switch"><input type="checkbox" id="setSafe"' + (s.safeSearch ? ' checked' : '') + '><span class="sl"></span></label></div>' +
      '<div class="set-row"><div><div class="t">Results per page</div>' +
        '<div class="d">How many results appear on each results page.</div></div>' +
        '<div class="radio-row" id="setPerPage">' + pills + '</div></div>' +
      '<div class="set-row"><div><div class="t">Dark mode</div>' +
        '<div class="d">Dark theme for the homepage and results.</div></div>' +
        '<label class="switch"><input type="checkbox" id="setDark"' + (s.darkMode ? ' checked' : '') + '><span class="sl"></span></label></div>' +
      '<div class="set-row"><div><div class="t">Search history</div>' +
        '<div class="d">' + G.store.history.length + ' saved searches on this device.</div></div>' +
        '<button class="btn" id="setClearHist">Clear</button></div>' +
    '</div></div>';

    G.dom.$('setBack').addEventListener('click', () => G.App.backFromPage());
    G.dom.$('setSafe').addEventListener('change', e => {
      G.store.settings.safeSearch = e.target.checked;
      G.store.saveSettings();
      G.toast('SafeSearch ' + (e.target.checked ? 'on' : 'off'));
    });
    G.dom.$('setDark').addEventListener('change', e => {
      G.store.settings.darkMode = e.target.checked;
      G.store.saveSettings();
      G.App.applyTheme();
    });
    G.dom.$('setPerPage').addEventListener('click', e => {
      const b = e.target.closest('[data-perpage]');
      if (!b) return;
      G.store.settings.perPage = parseInt(b.dataset.perpage, 10);
      G.store.saveSettings();
      G.dom.$('setPerPage').querySelectorAll('.radio-pill')
        .forEach(p => p.classList.toggle('active', p === b));
      G.toast('Results per page: ' + b.dataset.perpage);
    });
    G.dom.$('setClearHist').addEventListener('click', () => {
      G.store.clearHistory();
      G.Settings.render();
      G.toast('Search history cleared');
    });
  }
};
