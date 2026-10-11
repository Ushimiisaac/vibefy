"use client";

import { useEffect, useState } from "react";
import type { Song } from "@/lib/types";
import SongTable from "@/components/SongTable";
import { usePlayer } from "@/components/PlayerProvider";
import { useLibrary } from "@/components/LibraryProvider";
import { HeartIcon, PlayIcon } from "@/components/icons";

export default function LikedPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { playQueue } = usePlayer();
  const { likedIds } = useLibrary();

  useEffect(() => {
    fetch("/api/likes")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: Song[]) => {
        setSongs(rows);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  // Keep the view in sync when a song is unliked from the table.
  const visible = songs.filter((s) => likedIds.has(s.id));

  return (
    <div>
      <div className="flex items-end gap-6 bg-gradient-to-b from-indigo-800/70 to-transparent p-6 pb-8 md:p-8">
        <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-[#1DB954] shadow-2xl md:h-48 md:w-48">
          <HeartIcon className="h-16 w-16 text-white" filled />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest">
            Playlist
          </p>
          <h1 className="mb-2 text-4xl font-black tracking-tight md:text-6xl">
            Liked Songs
          </h1>
          <p className="text-sm text-zinc-300">{visible.length} songs</p>
        </div>
      </div>
      <div className="p-6 pt-0">
        {visible.length > 0 && (
          <button
            onClick={() => playQueue(visible, 0)}
            className="mb-6 flex h-13 items-center gap-2 rounded-full bg-[#1DB954] px-7 py-3 text-sm font-bold text-black transition hover:scale-105"
          >
            <PlayIcon className="h-4 w-4" /> Play
          </button>
        )}
        {loaded && visible.length === 0 ? (
          <p className="mt-10 text-center text-zinc-400">
            Songs you like will appear here. Tap the ♥ on any track.
          </p>
        ) : (
          <SongTable songs={visible} />
        )}
      </div>
    </div>
  );
}
