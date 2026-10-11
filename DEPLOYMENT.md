# 🚀 Deploying Vibefy — Go Live Guide

Vibefy is a Next.js (App Router) app with a PostgreSQL database (Drizzle ORM).
To go live you need: **(1)** a host that runs Next.js, **(2)** a cloud Postgres
database, **(3)** HTTPS (automatic on all hosts below — required for the PWA
install prompt, service worker, and offline downloads).

---

## Option A — Vercel + Neon (recommended, free tier)

### 1. Push the code to GitHub

```bash
git init
git add .
git commit -m "Vibefy music app"
git remote add origin https://github.com/YOUR_USERNAME/vibefy.git
git push -u origin main
```

### 2. Create the database (Neon)

1. Go to https://neon.tech → sign up (free) → **New Project**.
2. Copy the connection string, e.g.
   `postgresql://user:pass@ep-xxxx.aws.neon.tech/neondb?sslmode=require`

### 3. Deploy on Vercel

1. Go to https://vercel.com → **Add New… → Project** → import your GitHub repo.
2. Framework is auto-detected as Next.js. Before deploying, open
   **Environment Variables** and add:
   - `DATABASE_URL` = your Neon connection string
3. Click **Deploy**. You'll get `https://your-app.vercel.app`.

### 4. Create tables + seed data (run once from your machine)

```bash
# create the tables on the cloud database
DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require" npx drizzle-kit push

# seed the starter catalog + curated playlists
psql "postgresql://...neon.tech/neondb?sslmode=require" <<'SQL'
INSERT INTO songs (title, artist, album, genre, cover_url, audio_url, duration_sec) VALUES
('Neon Skyline', 'Aurora Pulse', 'Neon Horizons', 'Synthwave', '/covers/neon-horizons.jpg', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 372),
('Chrome Hearts', 'Aurora Pulse', 'Neon Horizons', 'Synthwave', '/covers/neon-horizons.jpg', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 425),
('Laser Nights', 'Aurora Pulse', 'Neon Horizons', 'Synthwave', '/covers/neon-horizons.jpg', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 320),
('Rainy Window', 'The Velvet Keys', 'Midnight Drive', 'Lo-Fi Chill', '/covers/midnight-drive.jpg', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 300),
('City Lights Fade', 'The Velvet Keys', 'Midnight Drive', 'Lo-Fi Chill', '/covers/midnight-drive.jpg', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 356),
('2AM Cruise', 'The Velvet Keys', 'Midnight Drive', 'Lo-Fi Chill', '/covers/midnight-drive.jpg', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 385),
('Golden Hour', 'Luna Waves', 'Golden Hour', 'Indie Pop', '/covers/golden-hour.jpg', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', 316),
('Sunlit Daydream', 'Luna Waves', 'Golden Hour', 'Indie Pop', '/covers/golden-hour.jpg', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', 302),
('Wildflower', 'Luna Waves', 'Golden Hour', 'Indie Pop', '/covers/golden-hour.jpg', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', 328),
('Voltage', 'Nova Static', 'Electric Dreams', 'EDM', '/covers/electric-dreams.jpg', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', 310),
('Pulse Machine', 'Nova Static', 'Electric Dreams', 'EDM', '/covers/electric-dreams.jpg', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', 340),
('Bassline Gravity', 'Nova Static', 'Electric Dreams', 'EDM', '/covers/electric-dreams.jpg', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', 296),
('Smooth Avenue', 'Jazzline Trio', 'Smooth Avenue', 'Jazz', '/covers/smooth-avenue.jpg', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', 365),
('Blue Note Stroll', 'Jazzline Trio', 'Smooth Avenue', 'Jazz', '/covers/smooth-avenue.jpg', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', 310),
('Mountain Echoes', 'Wildwood', 'Mountain Echoes', 'Folk', '/covers/mountain-echoes.jpg', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', 350),
('Riverstone', 'Wildwood', 'Mountain Echoes', 'Folk', '/covers/mountain-echoes.jpg', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', 298);

INSERT INTO playlists (name, description, cover_url, is_curated) VALUES
('Today''s Top Hits', 'The hottest tracks right now — all free, forever.', '/covers/electric-dreams.jpg', 1),
('Chill Vibes', 'Lay back and let the lo-fi waves roll in.', '/covers/midnight-drive.jpg', 1),
('Focus Flow', 'Instrumental grooves to keep you in the zone.', '/covers/smooth-avenue.jpg', 1);

INSERT INTO playlist_songs (playlist_id, song_id, position) VALUES
(1, 1, 0), (1, 7, 1), (1, 10, 2), (1, 12, 3), (1, 4, 4), (1, 15, 5),
(2, 4, 0), (2, 5, 1), (2, 6, 2), (2, 13, 3), (2, 16, 4),
(3, 13, 0), (3, 14, 1), (3, 2, 2), (3, 5, 3), (3, 9, 4);
SQL
```

### 5. Custom domain (optional)

Buy a domain (Namecheap, Cloudflare, ~$10/yr) → Vercel project →
**Settings → Domains** → add it → update the DNS records it shows you.
HTTPS certificates are issued automatically.

---

## Option B — Railway / Render (app + database in one place)

1. https://railway.app → **New Project → Deploy from GitHub repo**.
2. In the same project: **New → Database → PostgreSQL**.
3. On the web service, add env var `DATABASE_URL` referencing the Postgres
   plugin's connection string.
4. Build command: `npm run build` · Start command: `npm run start`.
5. Run `npx drizzle-kit push` + the seed SQL against the Railway DB URL
   (same as Option A step 4).

Render.com works the same way (Web Service + Managed Postgres).

---

## Option C — Your own VPS (Hetzner / DigitalOcean, ~$5/mo)

```bash
# on the server (Ubuntu)
sudo apt update && sudo apt install -y nodejs npm postgresql nginx certbot python3-certbot-nginx
git clone https://github.com/YOUR_USERNAME/vibefy.git && cd vibefy
npm install
echo 'DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db' > .env
npx drizzle-kit push        # then run the seed SQL
npm run build
# keep it running
npm i -g pm2 && pm2 start "npm run start" --name vibefy && pm2 save
# point nginx at port 3000 and get free HTTPS
sudo certbot --nginx -d yourdomain.com
```

---

## 📱 Publishing to Google Play & the App Store

Vibefy is already an installable PWA, so once it's live on HTTPS users can
install it free from the **Get the App** page. For real store listings:

### Google Play (easiest)
1. Go to https://www.pwabuilder.com → paste your live URL.
2. Download the generated **Android (TWA)** package.
3. Create a Google Play Console account (one-time **$25** fee).
4. Upload the `.aab`, add the Digital Asset Links file PWABuilder gives you
   to `public/.well-known/assetlinks.json`, submit for review.

### Apple App Store
1. Apple Developer account (**$99/year**).
2. Wrap the app with **Capacitor** (`npx cap add ios`) pointing at your URL,
   build in Xcode, and submit via App Store Connect.
3. Free alternative for iPhone users: Safari → **Share → Add to Home Screen**
   (no store, no fee — already supported).

---

## ⚠️ Before a public commercial launch

- Real-artist tracks (Asake, Burna Boy, …) play as **30-second previews** from
  Deezer's public API. Distributing them in a commercial store app may
  violate Deezer's API terms and store review policies. For a store-approved
  product, license your catalog (e.g., via a provider like 7digital/Soundcharts)
  or host royalty-free / original music.
- Keep `DATABASE_URL` secret — never commit `.env` to GitHub
  (add `.env` to `.gitignore`).

## Env vars checklist

| Variable | Where | Value |
|---|---|---|
| `DATABASE_URL` | Host dashboard | Cloud Postgres connection string |
