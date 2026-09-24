'use strict';
/* app.js — init, view router, results header, global wiring */
window.G = window.G || {};

G.App = (function(){
  let lastView = 'home';

  function hideAll(){
    for (const id of ['homeView', 'resultsView', 'historyView', 'settingsView'])
      G.dom.$(id).style.display = 'none';
  }

  function showView(name){
    if (name !== 'home' && name !== 'results') lastView = G.App.current || 'home';
    hideAll();
    if (name === 'home'){
      G.dom.$('homeView').style.display = 'flex';
      document.title = 'Google';
    } else if (name === 'results'){
      G.dom.$('resultsView').style.display = 'flex';
    } else if (name === 'history'){
      G.History.render();
      G.dom.$('historyView').style.display = 'flex';
      document.title = 'Search history - Google';
    } else if (name === 'settings'){
      G.Settings.render();
      G.dom.$('settingsView').style.display = 'flex';
      document.title = 'Search settings - Google';
    }
    G.App.current = name;
    window.scrollTo(0, 0);
  }

  function backFromPage(){
    // return to wherever makes sense: results if a query is active, else home
    if (G.store.q) showView('results');
    else showView('home');
  }

  function renderResultsHeader(){
    const ic = n => G.dom.icon(n);
    G.dom.$('resHeader').innerHTML =
      '<div class="wordmark small" id="resLogo" aria-label="Google home">' +
      '<span class="b">G</span><span class="r">o</span><span class="y">o</span>' +
      '<span class="b">g</span><span class="g">l</span><span class="r">e</span></div>' +
      '<div class="res-search" id="resSearchMount"></div>' +
      '<div style="margin-left:auto;display:flex;align-items:center;gap:6px">' +
        '<button class="icon-btn" id="resHistoryBtn" title="Search history">' + ic('clock') + '</button>' +
        '<button class="apps-icon" id="resAppsBtn" title="Google apps" aria-label="Google apps">' +
        '<span></span><span></span><span></span><span></span><span></span>' +
        '<span></span><span></span><span></span><span></span></button>' +
        '<button class="icon-btn" id="resThemeBtn" title="Toggle dark mode">' + ic('moon') + '</button>' +
        '<button class="icon-btn" id="resSettingsBtn" title="Search settings">' + ic('settings') + '</button>' +
        '<div class="avatar" title="Google Account">G</div>' +
      '</div>';
    G.dom.$('resSearchMount').innerHTML = G.Searchbox.html('res', { res: true });
    G.Searchbox.mount('res', v => submitSearch(v, 'res'));

    G.dom.$('resLogo').addEventListener('click', () => showView('home'));
    G.dom.$('resHistoryBtn').addEventListener('click', () => showView('history'));
    G.dom.$('resSettingsBtn').addEventListener('click', () => showView('settings'));
    G.dom.$('resThemeBtn').addEventListener('click', toggleTheme);
    G.dom.$('resAppsBtn').addEventListener('click', e => {
      e.stopPropagation();
      G.AppsMenu.toggle();
    });
    G.dom.$('resFooter').innerHTML = G.footerHTML();
  }

  function submitSearch(v, from){
    v = (v || '').trim();
    if (!v){ G.Searchbox.shake(from); return; }
    doSearch(v, 'all');
  }

  function doSearch(q, tab){
    q = q.trim();
    if (!q) return;
    G.store.q = q;
    G.store.tab = tab || 'all';
    G.store.page = 1;
    G.store.pushHistory(q);
    G.dom.$('resInput').value = q;
    document.title = q + ' - Google Search';
    showView('results');
    G.Tabs.renderBar();
    renderTab();
  }

  function renderTab(){
    const q = G.store.q;
    G.dom.$('resMain').onclick = null;
    if (G.store.tab === 'all'){
      G.Results.render();
    } else if (G.store.tab === 'images'){
      G.Tabs.renderImages(q);
      G.dom.$('resSide').innerHTML = '';
    } else if (G.store.tab === 'videos'){
      G.Tabs.renderVideos(q);
      G.dom.$('resSide').innerHTML = '';
    } else if (G.store.tab === 'news'){
      G.Tabs.renderNews(q);
      G.dom.$('resSide').innerHTML = '';
    } else if (G.store.tab === 'maps'){
      G.Tabs.renderMaps(q);
      G.dom.$('resSide').innerHTML = '';
    }
  }

  function gotoPage(p){
    G.store.page = p;
    renderTab();
    window.scrollTo(0, 0);
  }

  function applyTheme(){
    document.body.classList.toggle('dark', !!G.store.settings.darkMode);
  }
  function toggleTheme(){
    G.store.settings.darkMode = !G.store.settings.darkMode;
    G.store.saveSettings();
    applyTheme();
    G.toast(G.store.settings.darkMode ? 'Dark mode on' : 'Dark mode off');
  }

  function init(){
    G.store.load();
    G.store.syncHistory().catch(() => {}); // pull server history (no login), non-blocking
    applyTheme();
    G.Homepage.render();
    renderResultsHeader();
    showView('home');
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape'){
        for (const id of ['luckyOverlay', 'imgOverlay', 'voiceOverlay'])
          G.dom.$(id).classList.remove('show');
      }
    });
  }

  return {
    init, showView, doSearch, renderTab, gotoPage, submitSearch,
    backFromPage, applyTheme, toggleTheme, current: 'home'
  };
})();

document.addEventListener('DOMContentLoaded', () => G.App.init());
