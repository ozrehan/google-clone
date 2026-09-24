'use strict';
/* js/api.js — fetch wrapper for the Netlify Functions backend (/api/*).
   Generates a stable clientId in localStorage (no login — it's Google). */
window.G = window.G || {};

G.Api = (function(){
  const BASE = window.G_API_BASE || '/api';

  function clientId(){
    let id = null;
    try { id = localStorage.getItem('gclone_cid'); } catch (e) {}
    if (!id){
      id = 'c-' + Date.now().toString(36) + '-' +
        Math.random().toString(36).slice(2, 10);
      try { localStorage.setItem('gclone_cid', id); } catch (e) {}
    }
    return id;
  }

  async function req(method, path, body){
    const res = await fetch(BASE + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': clientId(),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok){
      const err = new Error('api ' + res.status);
      err.status = res.status;
      throw err;
    }
    return res.json();
  }

  return {
    clientId,
    search(q, opts){
      opts = opts || {};
      const p = new URLSearchParams({
        q, tab: opts.tab || 'web',
        start: String(opts.start || 0),
        perPage: String(opts.perPage || 10),
      });
      if (opts.chip) p.set('chip', opts.chip);
      return req('GET', '/search?' + p.toString());
    },
    suggest(q){ return req('GET', '/suggest?q=' + encodeURIComponent(q || '')); },
    trending(){ return req('GET', '/trending'); },
    history(){ return req('GET', '/history'); },
    pushHistory(q){ return req('POST', '/history', { q }); },
    clearHistory(){ return req('DELETE', '/history'); },
  };
})();
