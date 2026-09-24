# Google Clone — now with a REAL search backend

A pixel-faithful, fully interactive **Google Search** clone — vanilla HTML/CSS/JS
frontend, **real server-side search** via Netlify Functions + Netlify Blobs.
Queries hit an actual API: a 314-document index is ranked on the server,
suggestions come from a live endpoint (boosted by popular queries), and search
history is persisted per-client in blob storage — no login, just like Google.

## Features

- **Homepage** — span-built Google wordmark, search box with shadow hover, voice-search
  fake UI, "I'm Feeling Lucky" panel, footer links, shake animation on empty query
- **Real server search** (`netlify/functions/`) — tokenize → score 314 docs
  (title ×3, keywords ×2, snippet ×1, site bonus) → ranked results;
  deterministic fake result counts & timings
- **Did you mean** — Levenshtein edit-distance correction against the index vocabulary
- **Autocomplete** — `/api/suggest` backed by 134 curated queries + trending +
  globally popular queries (logged server-side), your recent searches inline
- **Results page** — favicon dots, `#1a0dab` links, bolded query terms, People Also Ask
  accordion, related searches, knowledge panel (16 entities), Gooooooogle pagination,
  Google-style skeleton loading while the server ranks
- **Tabs** — Images (server-ranked grid + lightbox), Videos (duration badges, view counts),
  News (server index with topic chips), Maps (placeholder)
- **"I'm Feeling Lucky"** — fetches the real #1 result and offers it as the destination
- **History page** — server-persisted per client (`history/{clientId}.json` in Blobs,
  cap 50), relative timestamps, one-click re-search, clear
- **Apps launcher** — 3×3 grid linking to the sibling clones
- **Settings page** — SafeSearch toggle, results-per-page (5/10/15/20), dark mode
- **Dark mode** — re-themes homepage and results via CSS variables, persisted
- **Offline fallback** — if the API is unreachable (e.g. `file://`), the original
  client-side engine (`js/search/engine-local.js`) takes over seamlessly

## Backend (Netlify Functions + Blobs)

```
netlify/
└── functions/
    ├── api.js              # ONE function, manual routing; exports createApp(store) + handler
    ├── rank.js             # tokenizer, scorer, did-you-mean, suggestions, knowledge lookup
    ├── index-data.js       # 314 hand-written docs, 16 knowledge entities, suggestions, trending
    ├── api.test.js         # 28 backend tests (node, in-memory store) — exit 0
    ├── smoke.test.js       # 16 end-to-end tests: frontend → real backend via mocked fetch
    └── node_modules/       # vendored @netlify/blobs (no build step needed)
```

Endpoints (JSON, no auth — it's Google):

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/search?q=&tab=web\|images\|news&start=&perPage=&chip=` | ranked results, total, count, secs, didYouMean, knowledge |
| GET | `/api/suggest?q=` | up to 8 completions (empty → trending) |
| GET | `/api/trending` | today's trending searches |
| GET | `/api/history` | per-client history (`x-client-id` header) |
| POST | `/api/history` `{q}` | record a search |
| DELETE | `/api/history` | clear history |

Run the tests:

```bash
cd netlify/functions
node api.test.js     # 28 backend tests
node smoke.test.js   # 16 frontend↔backend integration tests
```

## Project structure

```
google-clone/
├── index.html            # markup skeleton + inline SVG sprite + script tags
├── netlify.toml          # functions directory + /api/* → /.netlify/functions/api redirect
├── README.md
├── assets/
│   └── icons.svg         # icon sprite source (inlined in index.html for file:// safety)
├── css/
│   ├── variables.css     # design tokens + dark-mode overrides
│   ├── base.css          # reset, wordmark, icons, toast, overlays
│   ├── homepage.css      # topbar, hero, search box, suggestions, footer
│   ├── results.css       # result cards, PAA, knowledge card, pager, skeletons
│   ├── tabs.css          # tab bar, images, videos, news, lightbox
│   ├── appsmenu.css      # apps launcher dropdown
│   └── settings.css      # settings + history views
├── netlify/
│   └── functions/        # serverless search API (see Backend section)
└── js/
    ├── app.js            # init, view router (home/results/history/settings)
    ├── api.js            # fetch wrapper: clientId, /api/* calls
    ├── store.js          # state: query, tab, page, history (synced w/ server), settings
    ├── utils/
    │   ├── format.js     # number / time-ago / slug helpers
    │   └── dom.js        # hash, PRNG, escaping, icon(), toast, footer
    ├── data/
    │   ├── webindex.js   # legacy 72-doc index (offline fallback)
    │   ├── suggestions.js# legacy autocomplete list (offline fallback)
    │   └── news.js       # legacy news list (offline fallback)
    ├── search/
    │   ├── engine.js     # API-backed search/suggest/trending (falls back to engine-local)
    │   ├── engine-local.js # ORIGINAL client-side engine — offline fallback
    │   ├── knowledge.js  # knowledge-panel renderer (panelHTML for API entities)
    │   └── related.js    # People-Also-Ask + related searches
    └── components/
        ├── homepage.js   # home view
        ├── searchbox.js  # box markup, server autocomplete, voice UI
        ├── lucky.js      # "I'm Feeling Lucky" → real top result
        ├── results.js    # web results renderer + pager + skeletons
        ├── tabs.js       # tab bar, images/videos/news/maps
        ├── appsmenu.js   # apps launcher dropdown
        ├── settings.js   # settings page
        └── history.js    # history page (server-backed)
```

## Run

Deploy to Netlify (functions + static site ship together — see `netlify.toml`):

```bash
cd google-clone && zip -r /tmp/google-clone.zip . -x '*/.git/*'
# deploy the zip via the Netlify API / dashboard
```

Local frontend-only mode still works (`file://` safe) — the app automatically falls
back to the built-in client-side index when `/api` is unreachable:

```bash
cd google-clone && python3 -m http.server 8000
# → http://localhost:8000
```

Try: `python tutorial`, `best pizza`, `japn travel guide` (typo → "did you mean"),
`black holes`, `cricket world cup`, `leonardo da vinci` (knowledge panel).
