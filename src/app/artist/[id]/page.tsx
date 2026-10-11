"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { ArtistSummary, Song } from "@/lib/types";
import { formatFans } from "@/lib/types";
import SongTable from "@/components/SongTable";
import { usePlayer } from "@/components/PlayerProvider";
import { PlayIcon, ShuffleIcon } from "@/components/icons";

export default function ArtistPage() {
  const params = useParams<{ id: string }>();
  const [artist, setArtist] = useState<ArtistSummary | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const { playQueue, toggleShuffle, shuffle } = usePlayer();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/music/artist/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((data: { artist: ArtistSummary; songs: Song[] }) => {
        setArtist(data.artist);
        setSongs(data.songs);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [params.id]);

  if (error) {
    return <p className="p-10 text-center text-zinc-400">Artist not found.</p>;
  }
  if (loading || !artist) {
    return (
      <div className="p-10 text-center text-zinc-500">
        <span className="mx-auto mb-3 block h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-[#1DB954]" />
        Loading artist…
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <div className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 blur-2xl"
          style={{ backgroundImage: `url(${artist.picture})` }}
        />
        <div className="relative flex items-end gap-6 bg-gradient-to-b from-transparent to-zinc-900/90 p-6 pb-8 md:p-8">
          <img
            src={artist.picture}
            alt={artist.name}
            className="h-36 w-36 shrink-0 rounded-full object-cover shadow-2xl ring-4 ring-black/30 md:h-48 md:w-48"
          />
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#3b82f6]" fill="currentColor">
                <path d="M12 1.8 14.8 4l3.5-.4 1 3.4 3 1.8-1.4 3.2 1.4 3.2-3 1.8-1 3.4-3.5-.4L12 22.2 9.2 20l-3.5.4-1-3.4-3-1.8L3.1 12 1.7 8.8l3-1.8 1-3.4 3.5.4L12 1.8Zm4.6 7.5a.9.9 0 0 0-1.27-1.27l-4.4 4.4-1.96-1.96A.9.9 0 1 0 7.7 11.7l2.6 2.6a.9.9 0 0 0 1.27 0l5.03-5.02Z" />
              </svg>
              Verified Artist
            </p>
            <h1 className="mb-2 truncate text-4xl font-black tracking-tight md:text-7xl">
              {artist.name}
            </h1>
            <p className="text-sm text-zinc-200">
              {artist.fans ? `${formatFans(artist.fans)} · ` : ""}
              Top songs free to stream & download
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 pt-5">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => songs.length && playQueue(songs, 0)}
            className="flex items-center gap-2 rounded-full bg-[#1DB954] px-7 py-3 text-sm font-bold text-black transition hover:scale-105"
          >
            <PlayIcon className="h-4 w-4" /> Play
          </button>
          <button
            onClick={() => {
              if (!shuffle) toggleShuffle();
              if (songs.length) {
                playQueue(songs, Math.floor(Math.random() * songs.length));
              }
            }}
            className="flex items-center gap-2 rounded-full border border-zinc-600 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-white"
          >
            <ShuffleIcon className="h-4 w-4" /> Shuffle
          </button>
        </div>

        <h2 className="mb-4 text-xl font-bold">Popular</h2>
        {songs.length === 0 ? (
          <p className="text-sm text-zinc-400">
            No playable tracks found for this artist.
          </p>
        ) : (
          <SongTable songs={songs} />
        )}

        <p className="mt-8 text-xs text-zinc-500">
          Tracks play as high-quality previews from the global catalog — like,
          download for offline, and add them to your playlists free.
        </p>
      </div>
    </div>
  );
}
