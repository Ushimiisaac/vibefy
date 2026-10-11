"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ArtistSummary, Song } from "@/lib/types";
import { formatFans } from "@/lib/types";
import SongTable from "@/components/SongTable";
import { usePlayer } from "@/components/PlayerProvider";
import { PlayIcon, SearchIcon } from "@/components/icons";

const SUGGESTIONS = [
  "Asake",
  "Burna Boy",
  "Wizkid",
  "Davido",
  "Rema",
  "Ayra Starr",
  "Drake",
  "Taylor Swift",
];

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [artists, setArtists] = useState<ArtistSummary[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { playQueue } = usePlayer();
  const requestId = useRef(0);

  useEffect(() => {
    const query = q.trim();
    if (!query) {
      setArtists([]);
      setSongs([]);
      setSearched(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const id = ++requestId.current;
    const t = setTimeout(() => {
      fetch(`/api/music/search?q=${encodeURIComponent(query)}`)
        .then((r) => (r.ok ? r.json() : { artists: [], songs: [] }))
        .then((data: { artists: ArtistSummary[]; songs: Song[] }) => {
          if (id !== requestId.current) return;
          setArtists(data.artists);
          setSongs(data.songs);
          setSearched(true);
          setLoading(false);
        })
        .catch(() => {
          if (id !== requestId.current) return;
          setLoading(false);
          setSearched(true);
        });
    }, 350);
    return () => clearTimeout(t);
  }, [q]);

  const topArtist = artists[0] ?? null;

  return (
    <div className="p-6">
      <div className="relative mb-6 max-w-lg">
        <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search artists like Asake, Burna Boy, songs, albums…"
          className="w-full rounded-full bg-zinc-800 py-3 pl-12 pr-5 text-sm font-medium text-white outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-white/40"
        />
        {loading && (
          <span className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-zinc-500 border-t-[#1DB954]" />
        )}
      </div>

      {/* Empty state: suggestions */}
      {!searched && !loading && (
        <div>
          <h2 className="mb-4 text-xl font-bold">Try searching for</h2>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setQ(s)}
                className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
              >
                {s}
              </button>
            ))}
          </div>
          <p className="mt-6 text-sm text-zinc-500">
            Search the entire global catalog — every artist, with photos, top
            songs and albums, just like you expect.
          </p>
        </div>
      )}

      {searched && (
        <div className="space-y-8">
          {/* Top result + songs preview */}
          {(topArtist || songs.length > 0) && (
            <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
              {topArtist && (
                <section>
                  <h2 className="mb-3 text-xl font-bold">Top result</h2>
                  <Link
                    href={`/artist/${topArtist.id}`}
                    className="group block rounded-xl bg-zinc-800/50 p-5 transition hover:bg-zinc-800"
                  >
                    <div className="relative mb-4 inline-block">
                      <img
                        src={topArtist.picture}
                        alt={topArtist.name}
                        className="h-28 w-28 rounded-full object-cover shadow-2xl"
                      />
                      <span className="absolute -bottom-1 -right-1 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-[#1DB954] text-black opacity-0 shadow-xl transition group-hover:translate-y-0 group-hover:opacity-100">
                        <PlayIcon className="ml-0.5 h-4 w-4" />
                      </span>
                    </div>
                    <p className="text-2xl font-black">{topArtist.name}</p>
                    <p className="mt-1 text-sm text-zinc-400">
                      Artist{" "}
                      {topArtist.fans ? `· ${formatFans(topArtist.fans)}` : ""}
                    </p>
                  </Link>
                </section>
              )}

              {songs.length > 0 && (
                <section className="min-w-0">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Songs</h2>
                    <button
                      onClick={() => playQueue(songs, 0)}
                      className="flex items-center gap-2 rounded-full bg-[#1DB954] px-4 py-1.5 text-xs font-bold text-black transition hover:scale-105"
                    >
                      <PlayIcon className="h-3 w-3" /> Play all
                    </button>
                  </div>
                  <SongTable songs={songs.slice(0, 5)} />
                </section>
              )}
            </div>
          )}

          {/* Artists row */}
          {artists.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-bold">Artists</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {artists.map((a) => (
                  <Link
                    key={a.id}
                    href={`/artist/${a.id}`}
                    className="group rounded-lg bg-zinc-800/40 p-4 text-center transition hover:bg-zinc-800"
                  >
                    <img
                      src={a.picture}
                      alt={a.name}
                      className="mx-auto mb-3 aspect-square w-full rounded-full object-cover shadow-lg"
                    />
                    <p className="truncate text-sm font-bold">{a.name}</p>
                    <p className="text-xs text-zinc-400">
                      Artist{a.fans ? ` · ${formatFans(a.fans)}` : ""}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Full song list */}
          {songs.length > 5 && (
            <section>
              <h2 className="mb-4 text-xl font-bold">All songs</h2>
              <SongTable songs={songs} />
            </section>
          )}

          {songs.length === 0 && artists.length === 0 && !loading && (
            <p className="mt-16 text-center text-zinc-400">
              No results for “{q}”. Check the spelling or try another search.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
