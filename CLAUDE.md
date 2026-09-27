# OPTIX — Alejandro Buitrago · Director Portfolio

Cinematic, Omertá-style (joinomerta.com) single-page portfolio for **Alejandro Buitrago**, creative director & director. Built from an AI Studio starter. UI is in **English**.

## Stack & running it
- **Vite 6 + React 19 + TypeScript + Tailwind CSS v4.** No backend, no API key needed (the bundled `@google/genai` / `GEMINI_API_KEY` are **unused**).
- Node via **nvm** on the author's machines. Setup on a new computer:
  ```bash
  npm install
  npm run dev      # serves on http://localhost:3001 (see package.json)
  ```
- `npm run lint` = `tsc --noEmit` (typecheck). `npm run build` = production build to `dist/`.

## Where the content lives — single source of truth
**`src/data/initialProjects.ts`** holds everything editable:
- `INITIAL_PROJECTS` — the full catalog shown in the "Selected Work" gallery.
- `REEL_ORDER` — ordered list of project `id`s for the top scroll-driven cinematic reel (a curated **subset** of the catalog; the gallery still shows all).
- `CLIENT_LOGOS` — the "Selected Clients & Brands" list.
- `DIRECTOR_BIO` — name, title, bio text, quote, gear kit, etc.

### ⚠️ localStorage gotcha (important)
`App.tsx` loads projects from `localStorage` key **`kinetic_filmmaker_portfolio_projects_v1`** BEFORE falling back to `INITIAL_PROJECTS`. After editing the data file, the running app keeps showing the **old** list until you clear that key and reload:
```js
localStorage.removeItem('kinetic_filmmaker_portfolio_projects_v1'); location.reload();
```
During dev, a hard reload with a fresh query param (e.g. `?v=2`) also avoids stale module cache.

## Key components (`src/components/`)
- **HeroReel.tsx** — full-screen hero that autoplays a muted video on load from **`public/hero.mp4`** (`/hero.webm` fallback); if the file is missing it falls back to the featured project's thumbnail as a poster. Has a mute/unmute toggle. Big Cinzel serif headline "Close Enough / to feel it".
- **CinematicReel.tsx** — Omertá-style scroll sequence: each project in `REEL_ORDER` is a sticky full-screen "act" whose media scales/parallaxes/curtain-reveals on scroll, with varied motion per index. Plays a clip only when on screen (IntersectionObserver → at most one video decoding at a time). Uses `previewVideoUrl` (.mp4) if present, else the `thumbnailUrl` image.
- **WorksGallery.tsx** — filterable grid/index of the full catalog (category + role + search).
- **ProjectModal.tsx** — video lightbox. If a project has `embedRestricted: true` it shows a "rights-restricted, Watch on YouTube" fallback instead of the iframe (used for videos whose music blocks embedded playback, e.g. Sonnenalp).
- **AboutSection.tsx** — clients row + manifesto quote + bio + gear kit.
- **Header.tsx / Footer.tsx / ContactModal.tsx**.

## Project data model (`src/types.ts` → `VideoProject`)
Notable fields: `videoUrl` (YouTube link), `thumbnailUrl` (usually `https://i.ytimg.com/vi/<ID>/maxresdefault.jpg`), `previewVideoUrl?` (direct .mp4 for hover/reel autoplay — omit for YouTube-only), `location?` (shown on cards & in the detail's DETAILS panel, replaced the old camera-package field), `embedRestricted?`, `year` (number or a range string like `'2023–25'`), `duration`, `roles`, `category`.

## Adding / editing works
Edit `INITIAL_PROJECTS` directly. For a YouTube work: set `videoUrl` to the `youtu.be` link and **omit** `previewVideoUrl` (a YouTube URL there renders a dead `<video>`). Get metadata:
```bash
curl "https://www.youtube.com/oembed?url=<link>&format=json"     # title
# thumbnail: https://i.ytimg.com/vi/<ID>/maxresdefault.jpg
```
To feature a work in the top reel, add its `id` to `REEL_ORDER`.

## Videos for the reel / hero
- **Hero:** drop a file at `public/hero.mp4` (1080p H.264, ~5–15 MB, it autoplays muted). Optional `public/hero.webm`.
- **Per-project reel clips:** add short muted loop `.mp4`s under `public/` and set each project's `previewVideoUrl` (e.g. `/oakley.mp4`). Keep them short/light; only one plays at a time so it stays smooth.

## Pending / open items
- `The Lost Peru` and `Huamanpata` have placeholder `year: 2026` (no CV date yet).
- Some projects may still need real music-rights review to set `embedRestricted`.
- `public/hero.mp4` not yet added by the author.
