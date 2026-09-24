'use strict';
/* search/knowledge.js — knowledge panel for known entities + generic fallback */
window.G = window.G || {};

G.Knowledge = (function(){
  const ENTITIES = {
    'python': {
      title: 'Python', sub: 'Programming language · Created 1991',
      seed: 'python-knowledge',
      desc: 'Python is a high-level, interpreted programming language known for its readability and vast ecosystem. It dominates data science, web backends, automation, and AI development.',
      facts: [['Designed by','Guido van Rossum'],['Latest','Python 3.13'],['Paradigm','Multi-paradigm: OOP, functional'],['Typing','Dynamic, gradual (type hints)']]
    },
    'javascript': {
      title: 'JavaScript', sub: 'Programming language · Created 1995',
      seed: 'javascript-knowledge',
      desc: 'JavaScript is the programming language of the web, running in every browser. With Node.js it also powers servers, and frameworks like React and Vue dominate front-end development.',
      facts: [['Designed by','Brendan Eich'],['Standard','ECMAScript 2024'],['Runtime','Browsers, Node.js, Deno'],['Typing','Dynamic']]
    },
    'albert einstein': {
      title: 'Albert Einstein', sub: 'Theoretical physicist · 1879–1955',
      seed: 'einstein-knowledge',
      desc: 'Albert Einstein developed the theory of relativity, one of the two pillars of modern physics. His mass–energy equivalence formula E = mc² is the world\u2019s most famous equation.',
      facts: [['Born','14 March 1879, Ulm'],['Nobel Prize','Physics, 1921'],['Known for','Relativity, photoelectric effect'],['Died','18 April 1955']]
    },
    'paris': {
      title: 'Paris', sub: 'Capital of France',
      seed: 'paris-knowledge',
      desc: 'Paris is the capital and most populous city of France, a global center for art, fashion, gastronomy, and culture. Its landmarks include the Eiffel Tower, the Louvre, and Notre-Dame.',
      facts: [['Country','France'],['Population','~2.1 million (city)'],['Landmarks','Eiffel Tower · Louvre · Notre-Dame'],['Founded','3rd century BC']]
    },
    'japan': {
      title: 'Japan', sub: 'Island country in East Asia',
      seed: 'japan-knowledge',
      desc: 'Japan is an island nation in East Asia known for its blend of ancient tradition and cutting-edge technology, from Kyoto\u2019s temples to Tokyo\u2019s neon districts.',
      facts: [['Capital','Tokyo'],['Population','~124 million'],['Currency','Yen (¥)'],['Known for','Sushi · anime · bullet trains']]
    },
    'cricket': {
      title: 'Cricket', sub: 'Bat-and-ball sport',
      seed: 'cricket-knowledge',
      desc: 'Cricket is a bat-and-ball game played between two teams of eleven, hugely popular across South Asia, England, and Australia. Formats range from five-day Tests to three-hour T20s.',
      facts: [['Governed by','ICC'],['Formats','Test · ODI · T20'],['Top event','Cricket World Cup'],['Players per side','11']]
    },
    'pizza': {
      title: 'Pizza', sub: 'Italian dish',
      seed: 'pizza-knowledge',
      desc: 'Pizza is a savory Italian dish of flattened dough topped with tomato sauce, cheese, and toppings, baked in an oven. Naples is its birthplace; Margherita is the classic.',
      facts: [['Origin','Naples, Italy'],['Classic','Margherita'],['Base','Wheat dough · tomato · mozzarella'],['Oven temp','~450°C (wood-fired)']]
    },
    'black hole': {
      title: 'Black hole', sub: 'Region of spacetime',
      seed: 'blackhole-knowledge',
      desc: 'A black hole is a region of spacetime where gravity is so strong that nothing, not even light, can escape. The first direct image of one (M87*) was released in 2019.',
      facts: [['First imaged','M87* (2019)'],['Nearest known','Gaia BH1 (~1,560 ly)'],['Boundary','Event horizon'],['Theory','General relativity']]
    },
    'react': {
      title: 'React', sub: 'JavaScript UI library · Meta',
      seed: 'react-knowledge',
      desc: 'React is an open-source JavaScript library for building user interfaces, maintained by Meta. Its component model and virtual DOM made it the most widely used front-end library.',
      facts: [['Maintained by','Meta'],['Released','2013'],['Latest','React 19'],['Model','Components + hooks']]
    },
    'linux': {
      title: 'Linux', sub: 'Open-source operating system kernel',
      seed: 'linux-knowledge',
      desc: 'Linux is a free, open-source Unix-like OS kernel created by Linus Torvalds in 1991. It powers most servers, Android phones, and the world\u2019s top supercomputers.',
      facts: [['Creator','Linus Torvalds'],['Released','1991'],['License','GPLv2'],['Powers','Servers · Android · supercomputers']]
    }
  };

  function lookup(q){
    const key = String(q).toLowerCase().trim();
    if (ENTITIES[key]) return ENTITIES[key];
    // singular/plural-tolerant match
    for (const k of Object.keys(ENTITIES)){
      if (key.includes(k) || k.includes(key)) return ENTITIES[k];
    }
    return null;
  }

  function generic(q){
    const Q = G.fmt.titleCase(q), slug = G.fmt.slugify(q);
    return {
      title: Q, sub: 'Topic · Frequently searched term', seed: slug + '-knowledge',
      desc: '\u201C' + q + '\u201D is a popular search topic spanning tutorials, documentation, tools, and community discussion. Search interest in ' + q + ' has grown steadily as more guides, courses, and expert coverage become available.',
      facts: [['Category','Reference & learning'],
        ['Also searched', q + ' tutorial · ' + q + ' guide · ' + q + ' examples'],
        ['Content types','Guides, videos, news, docs'], ['Updated','September 2026']]
    };
  }

  function html(q){
    return panelHTML(lookup(q), q);
  }

  /** render a knowledge object (from the API, or lookup()) — null → generic */
  function panelHTML(k, q){
    const ent = k || generic(q);
    const esc = G.dom.esc;
    return '<div class="kcard">' +
      '<img class="kimg" src="https://picsum.photos/seed/' + ent.seed + '/680/360" alt="' + esc(q) + '" loading="lazy">' +
      '<div class="kcard-body"><h2>' + esc(ent.title) + '</h2><div class="sub">' + esc(ent.sub) + '</div>' +
      '<p>' + esc(ent.desc) + '</p>' +
      ent.facts.map(f => '<div class="kfact"><span class="k">' + esc(f[0]) + ':</span><span class="v">' + esc(f[1]) + '</span></div>').join('') +
      '</div></div>';
  }

  return { lookup, html, panelHTML };
})();
