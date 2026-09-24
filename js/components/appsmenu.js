'use strict';
/* components/appsmenu.js — Google-apps launcher grid (links to sibling demos) */
window.G = window.G || {};

G.AppsMenu = (function(){
  /* sibling clones live next to google-clone/ in the workspace */
  const APPS = [
    { name: 'Search',   ic: 'search', bg: '#4285F4', href: null },          // this app
    { name: 'X Clone',  ic: 'x',      bg: '#000000', href: '../twitter-clone/index.html' },
    { name: 'Telegram', ic: 'send',   bg: '#229ED9', href: '../telegram-clone/index.html' },
    { name: 'Instagram',ic: 'image',  bg: '#E1306C', href: '../instagram-clone/index.html' },
    { name: 'WhatsApp', ic: 'chat',   bg: '#25D366', href: '../whatsapp-clone/index.html' },
    { name: 'YouTube',  ic: 'play',   bg: '#FF0000', fake: 'YouTube' },
    { name: 'Maps',     ic: 'pin',    bg: '#34A853', fake: 'Maps' },
    { name: 'Drive',    ic: 'globe',  bg: '#FBBC05', fake: 'Drive' },
    { name: 'News',     ic: 'news',   bg: '#EA4335', fake: 'News' }
  ];

  function ensure(){
    let el = G.dom.$('appsMenu');
    if (!el){
      el = document.createElement('div');
      el.id = 'appsMenu';
      el.className = 'apps-menu';
      el.innerHTML = APPS.map((a, i) =>
        '<div class="app-cell" data-app="' + i + '">' +
        '<div class="app-ic" style="background:' + a.bg + '">' + G.dom.icon(a.ic, 'sm') + '</div>' +
        '<span>' + a.name + '</span></div>').join('');
      document.body.appendChild(el);
      el.addEventListener('click', e => {
        const c = e.target.closest('[data-app]');
        if (!c) return;
        const a = APPS[parseInt(c.dataset.app, 10)];
        el.classList.remove('show');
        if (a.href) window.location.href = a.href;
        else if (a.fake) G.fake(a.fake);
        else G.toast('You are already here');
      });
      document.addEventListener('click', e => {
        if (!e.target.closest('#appsMenu') && !e.target.closest('.apps-icon'))
          el.classList.remove('show');
      });
    }
    return el;
  }

  function toggle(){
    ensure().classList.toggle('show');
  }

  return { toggle };
})();
