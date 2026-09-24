# Google Clone

A high-fidelity, fully client-side clone of Google Search in a single
self-contained HTML file — no frameworks, no build step, no external JS.

## Run

Just open it — works from `file://` and when hosted:

- Double-click `index.html`, or
- serve it: `python3 -m http.server` in this folder, then open http://localhost:8000

## Features

- **Homepage** — span-built Google wordmark in official colors, rounded search box
  with magnifier/mic/lens SVG icons, "Google Search" + "I'm Feeling Lucky" buttons,
  apps grid, avatar, and footer links.
- **Working search** — every query generates ~8 plausible results locally
  (seeded PRNG, so results are stable per query): favicon dots, site names,
  URL breadcrumbs, blue titles, and snippets with the query **bolded**.
- **Tabs** — All, Images (picsum.photos grid + lightbox), Videos (thumbnails,
  duration badges, view counts), News (sources + timestamps), Maps (placeholder panel).
- **People also ask** — 4 query-specific questions, click to expand answers.
- **Knowledge card** — definition-style panel for the query with facts.
- **Related searches** (8, clickable) and **Gooooooooogle pagination** (10 pages).
- **I'm Feeling Lucky** — playful 🍀 landing panel with a fun destination.
- **Recent searches + suggestions** dropdown under the search box
  (localStorage with in-memory fallback). Empty query → shake animation.

All data is generated in-page JavaScript — no network calls except the
placeholder images from picsum.photos.
