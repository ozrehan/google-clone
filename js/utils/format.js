'use strict';
/* utils/format.js — number / time formatting helpers */
window.G = window.G || {};

G.fmt = {
  /** 1234567 -> "1,234,567" */
  num(n){ return Number(n).toLocaleString('en-US'); },

  /** "2 hours ago" style relative time from a timestamp */
  ago(ts){
    const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
    if (s < 60) return 'just now';
    const m = Math.floor(s / 60);
    if (m < 60) return m + (m === 1 ? ' minute ago' : ' minutes ago');
    const h = Math.floor(m / 60);
    if (h < 24) return h + (h === 1 ? ' hour ago' : ' hours ago');
    const d = Math.floor(h / 24);
    if (d < 7) return d + (d === 1 ? ' day ago' : ' days ago');
    return new Date(ts).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  },

  /** Title-case a query for headings */
  titleCase(s){
    return String(s).replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());
  },

  /** URL-safe slug for picsum seeds etc. */
  slugify(s){
    return String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '').slice(0, 18) || 'search';
  }
};
