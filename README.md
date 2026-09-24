# Google Clone

A pixel-faithful, fully interactive **Google Search** clone — vanilla HTML/CSS/JS,
no frameworks, no build step. Search actually works: a real ranking engine scores
a 72-document local index by keyword overlap, with typo-tolerant "did you mean".

## Features

- **Homepage** — span-built Google wordmark, search box with shadow hover, voice-search
  fake UI, "I'm Feeling Lucky" panel, footer links, shake animation on empty query
- **Real search engine** (`js/search/engine.js`) — tokenize → score docs
  (title ×7, keywords ×5, snippet ×2, topic/site ×1) → ranked results;
  deterministic fake result counts & timings
- **Did you mean** — Levenshtein edit-distance correction against the index vocabulary
- **Autocomplete** — 122-query suggestion list + your recent searches, trending when empty
- **Results page** — favicon dots, `#1a0dab` links, bolded query terms, relevance scores,
  People Also Ask accordion, related searches, knowledge panel (10 known entities),
  Gooooooogle pagination honoring results-per-page
- **Tabs** — Images (grid + lightbox), Videos (duration badges, view counts),
  News (20 articles with topic chips), Maps (placeholder)
- **Apps launcher** — 3×3 grid linking to the sibling clones
- **Settings page** — SafeSearch toggle, results-per-page (5/10/15/20), dark mode
- **History page** — past queries with relative timestamps, one-click re-search, clear
- **Dark mode** — re-themes homepage and results via CSS variables, persisted
- Everything persisted in `localStorage` (history, settings); degrades gracefully on `file://`

## Project structure

```
google-clone/
├── index.html            # markup skeleton + inline SVG sprite + script tags
├── README.md
├── assets/
│   └── icons.svg         # icon sprite source (inlined in index.html for file:// safety)
├── css/
│   ├── variables.css     # design tokens + dark-mode overrides
│   ├── base.css          # reset, wordmark, icons, toast, overlays
│   ├── homepage.css      # topbar, hero, search box, suggestions, footer
│   ├── results.css       # result cards, PAA, knowledge card, pager
│   ├── tabs.css          # tab bar, images, videos, news, lightbox
│   ├── appsmenu.css      # apps launcher dropdown
│   └── settings.css      # settings + history views
└── js/
    ├── app.js            # init, view router (home/results/history/settings)
    ├── store.js          # state: query, tab, page, history, settings
    ├── utils/
    │   ├── format.js     # number / time-ago / slug helpers
    │   └── dom.js        # hash, PRNG, escaping, icon(), toast, footer
    ├── data/
    │   ├── webindex.js   # 72-document search index (tech, science, travel, food, sports)
    │   ├── suggestions.js# 122 autocomplete queries
    │   └── news.js       # 20 news articles with topics
    ├── search/
    │   ├── engine.js     # tokenizer, scorer, did-you-mean, fallback generator
    │   ├── knowledge.js  # knowledge-panel entities + generic fallback
    │   └── related.js    # People-Also-Ask + related searches
    └── components/
        ├── homepage.js   # home view
        ├── searchbox.js  # box markup, autocomplete, voice UI
        ├── lucky.js      # "I'm Feeling Lucky" panel
        ├── results.js    # web results renderer + pager
        ├── tabs.js       # tab bar, images/videos/news/maps
        ├── appsmenu.js   # apps launcher dropdown
        ├── settings.js   # settings page
        └── history.js    # history page
```

## Run

Just open `index.html` in a browser — no server needed (`file://` safe; classic
`<script>` tags, relative paths, no modules). Or serve statically:

```bash
cd google-clone && python3 -m http.server 8000
# → http://localhost:8000
```

Try: `python tutorial`, `best pizza`, `japn travel guide` (typo → "did you mean"),
`black holes`, `cricket world cup`.
