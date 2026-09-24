'use strict';
/* store.js — central state: query, tab, page, history, settings (localStorage) */
window.G = window.G || {};

G.store = {
  q: '',
  tab: 'all',
  page: 1,
  newsChip: 'top',
  history: [],    // [{q, t}]
  settings: { safeSearch: true, perPage: 10, darkMode: false },

  load(){
    try {
      const h = JSON.parse(localStorage.getItem('gclone_history') || '[]');
      if (Array.isArray(h)) this.history = h.slice(0, 20);
    } catch (e) { /* storage unavailable (file:// in some browsers) */ }
    try {
      const s = JSON.parse(localStorage.getItem('gclone_settings') || '{}');
      this.settings = Object.assign(this.settings, s);
    } catch (e) {}
  },
  _save(key, val){
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  },
  saveHistory(){ this._save('gclone_history', this.history.slice(0, 20)); },
  saveSettings(){ this._save('gclone_settings', this.settings); },

  pushHistory(q){
    q = q.trim();
    if (!q) return;
    this.history = [{ q, t: Date.now() },
      ...this.history.filter(h => h.q.toLowerCase() !== q.toLowerCase())].slice(0, 20);
    this.saveHistory();
  },
  clearHistory(){
    this.history = [];
    this.saveHistory();
  },
  recentQueries(prefix, n){
    const p = (prefix || '').toLowerCase();
    return this.history
      .filter(h => !p || h.q.toLowerCase().includes(p))
      .slice(0, n || 4);
  }
};
