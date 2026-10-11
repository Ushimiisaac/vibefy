"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { PlaylistWithSongs, Song } from "@/lib/types";
import SongTable from "@/components/SongTable";
import { usePlayer } from "@/components/PlayerProvider";
import { useLibrary } from "@/components/LibraryProvider";
import { MusicIcon, PlayIcon, TrashIcon } from "@/components/icons";

export default function PlaylistPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const [playlist, setPlaylist] = useState<PlaylistWithSongs | null>(null);
  const [notFound, setNotFound] = useState(false);
  const { playQueue } = usePlayer();
  const { refreshPlaylists } = useLibrary();

  const load = useCallback(() => {
    fetch(`/api/playlists/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then(setPlaylist)
      .catch(() => setNotFound(true));
  }, [id]);

  useEffect(load, [load]);

  async function removeSong(song: Song) {
    await fetch(`/api/playlists/${id}/songs?songId=${song.id}`, {
      method: "DELETE",
    });
    load();
    refreshPlaylists();
  }

  async function deletePlaylist() {
    if (!confirm("Delete this playlist?")) return;
    await fetch(`/api/playlists/${id}`, { method: "DELETE" });
    await refreshPlaylists();
    router.push("/");
  }

  if (notFound) {
    return (
      <p className="p-10 text-center text-zinc-400">Playlist not found.</p>
    );
  }
  if (!playlist) {
    return <p className="p-10 text-center text-zinc-500">Loading…</p>;
  }

  const cover = playlist.coverUrl ?? playlist.songs[0]?.coverUrl ?? null;
  const totalSec = playlist.songs.reduce((s, x) => s + x.durationSec, 0);

  return (
    <div>
      <div className="flex items-end gap-6 bg-gradient-to-b from-zinc-700/70 to-transparent p-6 pb-8 md:p-8">
        {cover ? (
          <img
            src={cover}
            alt={playlist.name}
            className="h-36 w-36 shrink-0 rounded-lg object-cover shadow-2xl md:h-48 md:w-48"
          />
        ) : (
          <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-lg bg-zinc-800 shadow-2xl md:h-48 md:w-48">
            <MusicIcon className="h-16 w-16 text-zinc-500" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest">
            {playlist.isCurated ? "Curated playlist" : "Your playlist"}
          </p>
          <h1 className="mb-2 truncate text-4xl font-black tracking-tight md:text-6xl">
            {playlist.name}
          </h1>
          {playlist.description && (
            <p className="mb-1 text-sm text-zinc-300">
              {playlist.description}
            </p>
          )}
          <p className="text-sm text-zinc-400">
            {playlist.songs.length} songs · about{" "}
            {Math.max(1, Math.round(totalSec / 60))} min
          </p>
        </div>
      </div>

      <div className="p-6 pt-0">
        <div className="mb-6 flex items-center gap-4">
          {playlist.songs.length > 0 && (
            <button
              onClick={() => playQueue(playlist.songs, 0)}
              className="flex items-center gap-2 rounded-full bg-[#1DB954] px-7 py-3 text-sm font-bold text-black transition hover:scale-105"
            >
              <PlayIcon className="h-4 w-4" /> Play
            </button>
          )}
          {!playlist.isCurated && (
            <button
              onClick={deletePlaylist}
              className="flex items-center gap-2 rounded-full border border-zinc-600 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-red-400 hover:text-red-400"
            >
              <TrashIcon className="h-4 w-4" /> Delete playlist
            </button>
          )}
        </div>

        {playlist.songs.length === 0 ? (
          <p className="mt-10 text-center text-sm text-zinc-400">
            This playlist is empty. Browse songs and use the + button to add
            tracks.
          </p>
        ) : (
          <SongTable
            songs={playlist.songs}
            showRemove={playlist.isCurated ? undefined : removeSong}
          />
        )}
      </div>
    </div>
  );
}
