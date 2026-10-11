# 🎧 Vibefy — Free Music for Everyone

A Spotify-style music streaming app where **every premium feature is free**:
no ads, unlimited skips, offline downloads, playlists, and liked songs.
Installable on Android and iPhone as a PWA.

## Features

- 🎵 Stream a built-in catalog + search the **global music catalog** (real
  artists with photos, top tracks, albums via the Deezer public API)
- 👤 Spotify-style artist pages with hero photos and popular tracks
- ❤️ Liked Songs, custom playlists, curated playlists
- 📥 **Offline downloads** — songs stored in IndexedDB, playable with no internet
- 🔀 Full player: shuffle, repeat (off/all/one), seek, volume, media-session
  lock-screen controls
- 📱 Installable PWA with service worker (Android "Install app" /
  iPhone "Add to Home Screen")

## Tech stack

- **Next.js** (App Router) + TypeScript + Tailwind CSS
- **PostgreSQL** with **Drizzle ORM**
- PWA: manifest + service worker; offline audio in IndexedDB

## Local development

```bash
npm install
# set DATABASE_URL in .env, e.g.
# DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
npx drizzle-kit push       # create tables
npm run dev                # http://localhost:3000
```

Seed data: see the SQL block in [DEPLOYMENT.md](./DEPLOYMENT.md).

## Deploying / going live

Full step-by-step guide (Vercel + Neon free tier, Railway, VPS, and
Google Play / App Store publishing): **[DEPLOYMENT.md](./DEPLOYMENT.md)**

## ⚠️ Licensing note

Real-artist tracks play as 30-second previews from Deezer's public API.
For a commercial launch, use a licensed or royalty-free catalog.
