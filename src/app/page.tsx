"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ArtistSummary, Song } from "@/lib/types";
import { formatFans } from "@/lib/types";
import SongTable from "@/components/SongTable";
import { usePlayer } from "@/components/PlayerProvider";
import { useLibrary } from "@/components/LibraryProvider";
import { PlayIcon } from "@/components/icons";

export default function HomePage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [recent, setRecent] = useState<Song[]>([]);
  const [popularArtists, setPopularArtists] = useState<ArtistSummary[]>([]);
  const { playQueue } = usePlayer();
  const { playlists } = useLibrary();

  useEffect(() => {
    fetch("/api/songs")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: Song[]) => setSongs(rows.filter((s) => !s.externalId)))
      .catch(() => {});
    fetch("/api/plays")
      .then((r) => (r.ok ? r.json() : []))
      .then(setRecent)
      .catch(() => {});
    fetch("/api/music/popular")
      .then((r) => (r.ok ? r.json() : []))
      .then(setPopularArtists)
      .catch(() => {});
  }, []);

  const albums = useMemo(() => {
    const map = new Map<string, { album: string; artist: string; coverUrl: string; tracks: Song[] }>();
    for (const s of songs) {
      const entry = map.get(s.album) ?? {
        album: s.album,
        artist: s.artist,
        coverUrl: s.coverUrl,
        tracks: [],
      };
      entry.tracks.push(s);
      map.set(s.album, entry);
    }
    return Array.from(map.values());
  }, [songs]);

  const curated = playlists.filter((p) => p.isCurated);
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-6">
      {/* Free premium hero */}
      <section className="mb-8 rounded-2xl bg-gradient-to-r from-[#1DB954]/30 via-emerald-900/40 to-zinc-900 p-6 md:p-8">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#1DB954]">
          100% free · forever
        </p>
        <h1 className="mb-2 text-3xl font-black tracking-tight md:text-4xl">
          {greeting}. All of Premium, for everyone.
        </h1>
        <p className="mb-4 max-w-2xl text-sm text-zinc-300">
          No ads. Unlimited skips. Highest audio quality. Offline downloads.
          Everything Spotify charges for — Vibefy gives you free, on Android
          and iPhone.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => songs.length && playQueue(songs, 0)}
            className="flex items-center gap-2 rounded-full bg-[#1DB954] px-6 py-2.5 text-sm font-bold text-black transition hover:scale-105"
          >
            <PlayIcon className="h-4 w-4" /> Play all
          </button>
          <Link
            href="/get-app"
            className="rounded-full border border-zinc-500 px-6 py-2.5 text-sm font-bold text-white transition hover:border-white"
          >
            Get the mobile app
          </Link>
        </div>
      </section>

      {/* Popular artists */}
      {popularArtists.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-bold">Popular artists</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {popularArtists.map((a) => (
              <Link
                key={a.id}
                href={`/artist/${a.id}`}
                className="group w-36 shrink-0 rounded-lg bg-zinc-800/40 p-3 text-center transition hover:bg-zinc-800"
              >
                <img
                  src={a.picture}
                  alt={a.name}
                  className="mx-auto mb-2 aspect-square w-full rounded-full object-cover shadow-lg"
                />
                <p className="truncate text-sm font-semibold">{a.name}</p>
                <p className="truncate text-xs text-zinc-400">
                  {a.fans ? formatFans(a.fans) : "Artist"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Curated playlists */}
      {curated.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-bold">Made for you</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {curated.map((p) => (
              <Link
                key={p.id}
                href={`/playlist/${p.id}`}
                className="group rounded-lg bg-zinc-800/40 p-3 transition hover:bg-zinc-800"
              >
                <img
                  src={p.coverUrl ?? "/icons/icon-512.png"}
                  alt={p.name}
                  className="mb-3 aspect-square w-full rounded-md object-cover shadow-lg"
                />
                <p className="truncate text-sm font-bold">{p.name}</p>
                <p className="line-clamp-2 text-xs text-zinc-400">
                  {p.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recently played */}
      {recent.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-bold">Recently played</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {recent.map((s, i) => (
              <button
                key={s.id}
                onClick={() => playQueue(recent, i)}
                className="group w-36 shrink-0 rounded-lg bg-zinc-800/40 p-3 text-left transition hover:bg-zinc-800"
              >
                <img
                  src={s.coverUrl}
                  alt={s.title}
                  className="mb-2 aspect-square w-full rounded-md object-cover"
                />
                <p className="truncate text-sm font-semibold">{s.title}</p>
                <p className="truncate text-xs text-zinc-400">{s.artist}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Albums */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-bold">Popular albums</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {albums.map((a) => (
            <button
              key={a.album}
              onClick={() => playQueue(a.tracks, 0)}
              className="group relative rounded-lg bg-zinc-800/40 p-3 text-left transition hover:bg-zinc-800"
            >
              <img
                src={a.coverUrl}
                alt={a.album}
                className="mb-3 aspect-square w-full rounded-md object-cover shadow-lg"
              />
              <span className="absolute bottom-16 right-5 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-[#1DB954] text-black opacity-0 shadow-xl transition group-hover:translate-y-0 group-hover:opacity-100">
                <PlayIcon className="ml-0.5 h-4 w-4" />
              </span>
              <p className="truncate text-sm font-bold">{a.album}</p>
              <p className="truncate text-xs text-zinc-400">{a.artist}</p>
            </button>
          ))}
        </div>
      </section>

      {/* All songs */}
      <section>
        <h2 className="mb-4 text-xl font-bold">All songs</h2>
        <SongTable songs={songs} />
      </section>
    </div>
  );
}
