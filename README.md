# Google Clone — real search backend

A Google Search clone with a **real server-side backend**: vanilla HTML/CSS/JS
frontend, Netlify Function API, Netlify Blobs persistence.

## Features

- **Homepage** — text-drawn colorful logo (no Google image assets), rounded
  search box with shadow, "Google Search" and "I'm Feeling Lucky" buttons,
  top-right Sign in + apps grid, dark/light mode
- **Real server search** — queries are aggregated server-side from the
  Wikipedia API and DuckDuckGo instant answers, normalized to Google-style
  results (title link, URL breadcrumb, snippet), cached in Blobs for 1 hour
- **Results page** — "About N results" line, instant-answer box, pagination
- **Auth** — signup/login with salted SHA-256 passwords, 32-hex session
  tokens (30-day expiry) stored server-side
- **History** — every authenticated search is logged; view/clear it
- **Saved searches** — save, list, and remove queries (login required)

## API

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/auth/signup | – | {username,name,password} → {token,user} |
| POST | /api/auth/login | – | {username,password} → {token,user} |
| GET | /api/me | yes | current user |
| GET | /api/search?q=… | optional | real results + instant answer |
| GET | /api/history | yes | recent searches |
| DELETE | /api/history | yes | clear history |
| GET/POST | /api/saved | yes | saved searches |
| DELETE | /api/saved/:id | yes | remove saved search |

## Deploy

`python3 ~/workspace/bin/netlify-deploy.py <site_id> ~/workspace/google-clone`
bundles `netlify/functions/api.js` with esbuild (bundling `@netlify/blobs`)
and publishes via the Netlify API.
