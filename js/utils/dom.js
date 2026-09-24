'use strict';
/* utils/dom.js — DOM helpers, escaping, icons, toast */
window.G = window.G || {};

/* FNV-1a hash → deterministic pseudo-random per string */
G.hashStr = function(s){
  let h = 2166136261;
  for (let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
};
/* seeded PRNG */
G.mulberry32 = function(a){
  return function(){
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
};

G.dom = {
  $: id => document.getElementById(id),

  /** escape HTML */
  esc(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  },
  escRe(s){ return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); },

  /** bold whole-word occurrences of each query word (case-insensitive) */
  boldQ(text, q){
    const words = String(q).trim().split(/\s+/).filter(w => w.length > 1)
      .sort((a, b) => b.length - a.length);
    let out = G.dom.esc(text);
    for (const w of words){
      out = out.replace(new RegExp('(' + G.dom.escRe(G.dom.esc(w)) + ')', 'gi'), '<b>$1</b>');
    }
    return out;
  },

  /** <svg class="ic"><use href="#i-search"/></svg> — icons live in the inline sprite */
  icon(name, cls){
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '" aria-hidden="true">' +
      '<use href="#i-' + name + '"></use></svg>';
  }
};

/* toast */
let _toastT = null;
G.toast = function(msg){
  const t = G.dom.$('toast');
  t.textContent = msg;
  t.style.display = 'block';
  clearTimeout(_toastT);
  _toastT = setTimeout(() => { t.style.display = 'none'; }, 2200);
};
G.fake = function(name){ G.toast(name + ' — demo clone'); return false; };

/* shared footer markup */
G.footerHTML = function(){
  const link = n => '<a href="#" onclick="return G.fake(\'' + n + '\')">' + n + '</a>';
  const set = '<a href="#" onclick="G.App.showView(\'settings\');return false">Settings</a>';
  return '<div class="footer"><div class="footer-inner"><div>' +
    link('About') + link('Advertising') + link('Business') + link('How Search works') +
    '</div><div>' + link('Privacy') + link('Terms') + set + '</div></div></div>';
};
