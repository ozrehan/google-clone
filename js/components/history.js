'use strict';
/* components/history.js — search history page */
window.G = window.G || {};

G.History = {
  render(){
    const items = G.store.history;
    G.dom.$('historyView').innerHTML =
    '<div class="page-view"><div class="page-head">' +
      '<button class="icon-btn" id="histBack" title="Back">' + G.dom.icon('arrow', 'sm') + '</button>' +
      '<h1>Search history</h1></div>' +
    '<div class="page-body">' +
      (items.length
        ? '<div class="hist-actions"><button class="btn" id="histClear">Clear all history</button></div>' +
          items.map(h =>
            '<div class="hist-row" data-q="' + G.dom.esc(h.q) + '">' +
            G.dom.icon('clock', 'sm') +
            '<span class="q">' + G.dom.esc(h.q) + '</span>' +
            '<span class="t">' + G.fmt.ago(h.t) + '</span></div>').join('')
        : '<div class="hist-empty">🕘<br>No searches yet.<br>Your recent searches will appear here.</div>') +
    '</div></div>';

    G.dom.$('histBack').addEventListener('click', () => G.App.backFromPage());
    const clear = G.dom.$('histClear');
    if (clear) clear.addEventListener('click', () => {
      G.store.clearHistory();
      G.History.render();
      G.toast('Search history cleared');
    });
    G.dom.$('historyView').querySelectorAll('.hist-row').forEach(r => {
      r.addEventListener('click', () => G.App.doSearch(r.dataset.q, 'all'));
    });
  }
};
