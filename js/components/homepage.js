'use strict';
/* components/homepage.js — home view: topbar, hero, wordmark, buttons, footer */
window.G = window.G || {};

G.Homepage = {
  render(){
    const ic = (n, cls) => G.dom.icon(n, cls);
    G.dom.$('homeView').innerHTML = '' +
    '<div class="topbar">' +
      '<a href="#" onclick="return G.fake(\'Gmail\')">Gmail</a>' +
      '<a href="#" id="homeImagesLink">Images</a>' +
      '<button class="icon-btn" id="homeHistoryBtn" title="Search history">' + ic('clock') + '</button>' +
      '<button class="apps-icon" id="homeAppsBtn" title="Google apps" aria-label="Google apps">' +
        '<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>' +
      '</button>' +
      '<button class="icon-btn" id="homeThemeBtn" title="Toggle dark mode">' + ic('moon') + '</button>' +
      '<div class="avatar" title="Google Account">G</div>' +
    '</div>' +
    '<div class="hero">' +
      '<div class="wordmark big" aria-label="Google"><span class="b">G</span><span class="r">o</span>' +
      '<span class="y">o</span><span class="b">g</span><span class="g">l</span><span class="r">e</span></div>' +
      '<div id="homeSearchMount"></div>' +
      '<div class="home-buttons">' +
        '<button class="btn" id="homeSearchBtn">Google Search</button>' +
        '<button class="btn" id="homeLuckyBtn">I\'m Feeling Lucky</button>' +
      '</div>' +
    '</div>' +
    G.footerHTML();

    G.dom.$('homeSearchMount').innerHTML = G.Searchbox.html('home');
    const submit = v => G.App.submitSearch(v, 'home');
    G.Searchbox.mount('home', submit);
    G.dom.$('homeSearchBtn').addEventListener('click', () => submit(G.dom.$('homeInput').value));
    G.dom.$('homeLuckyBtn').addEventListener('click', () => G.Lucky.feeling(G.dom.$('homeInput').value));
    G.dom.$('homeImagesLink').addEventListener('click', e => {
      e.preventDefault();
      const v = G.dom.$('homeInput').value.trim();
      if (!v){ G.toast('Type something to search first'); return; }
      G.App.doSearch(v, 'images');
    });
    G.dom.$('homeHistoryBtn').addEventListener('click', () => G.App.showView('history'));
    G.dom.$('homeThemeBtn').addEventListener('click', () => G.App.toggleTheme());
    G.dom.$('homeAppsBtn').addEventListener('click', e => {
      e.stopPropagation();
      G.AppsMenu.toggle(G.dom.$('homeAppsBtn'));
    });
  }
};
