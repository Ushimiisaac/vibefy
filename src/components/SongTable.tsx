"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useState } from "react";
import type { Song } from "@/lib/types";
import { formatDuration } from "@/lib/types";
import { usePlayer } from "./PlayerProvider";
import { useLibrary } from "./LibraryProvider";
import {
  CheckCircleIcon,
  DownloadIcon,
  HeartIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  TrashIcon,
} from "./icons";

type Props = {
  songs: Song[];
  showRemove?: (song: Song) => void | Promise<void>;
};

export default function SongTable({ songs, showRemove }: Props) {
  const { current, isPlaying, playQueue, togglePlay } = usePlayer();
  const {
    likedIds,
    toggleLike,
    playlists,
    addToPlaylist,
    downloadedIds,
    downloadingIds,
    downloadSong,
    removeDownload,
  } = useLibrary();
  const [menuSongId, setMenuSongId] = useState<number | null>(null);
  const [addedMsg, setAddedMsg] = useState<string | null>(null);

  const editablePlaylists = playlists.filter((p) => !p.isCurated);

  async function handleAdd(playlistId: number, songId: number) {
    await addToPlaylist(playlistId, songId);
    setMenuSongId(null);
    setAddedMsg("Added to playlist");
    setTimeout(() => setAddedMsg(null), 2000);
  }

  return (
    <div className="relative">
      {addedMsg && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#1DB954] px-4 py-2 text-sm font-bold text-black shadow-lg">
          {addedMsg}
        </div>
      )}
      <div className="hidden grid-cols-[2rem_1fr_1fr_6rem_3rem] gap-4 border-b border-zinc-800 px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:grid">
        <span>#</span>
        <span>Title</span>
        <span>Album</span>
        <span>Actions</span>
        <span className="text-right">Time</span>
      </div>
      <ul>
        {songs.map((song, i) => {
          const isCurrent = current?.id === song.id;
          const liked = likedIds.has(song.id);
          const downloaded = downloadedIds.has(song.id);
          const downloading = downloadingIds.has(song.id);
          return (
            <li
              key={song.id}
              className={`group grid grid-cols-[2rem_1fr_6rem] items-center gap-4 rounded-md px-4 py-2 transition hover:bg-zinc-800/60 md:grid-cols-[2rem_1fr_1fr_6rem_3rem] ${
                isCurrent ? "bg-zinc-800/40" : ""
              }`}
            >
              <button
                onClick={() =>
                  isCurrent ? togglePlay() : playQueue(songs, i)
                }
                className="flex h-8 w-8 items-center justify-center text-zinc-400 hover:text-white"
                title="Play"
              >
                {isCurrent && isPlaying ? (
                  <PauseIcon className="h-4 w-4 text-[#1DB954]" />
                ) : (
                  <>
                    <span
                      className={`text-sm tabular-nums group-hover:hidden ${
                        isCurrent ? "text-[#1DB954]" : ""
                      }`}
                    >
                      {i + 1}
                    </span>
                    <PlayIcon className="hidden h-4 w-4 group-hover:block" />
                  </>
                )}
              </button>

              <div className="flex min-w-0 items-center gap-3">
                <img
                  src={song.coverUrl}
                  alt={song.album}
                  className="h-10 w-10 shrink-0 rounded object-cover"
                />
                <div className="min-w-0">
                  <p
                    className={`truncate text-sm font-semibold ${
                      isCurrent ? "text-[#1DB954]" : "text-white"
                    }`}
                  >
                    {song.title}
                  </p>
                  {song.artistExternalId ? (
                    <Link
                      href={`/artist/${song.artistExternalId}`}
                      className="block truncate text-xs text-zinc-400 hover:text-white hover:underline"
                    >
                      {song.artist}
                    </Link>
                  ) : (
                    <p className="truncate text-xs text-zinc-400">
                      {song.artist}
                    </p>
                  )}
                </div>
              </div>

              <span className="hidden truncate text-sm text-zinc-400 md:block">
                {song.album}
              </span>

              <div className="relative flex items-center gap-2.5">
                <button
                  onClick={() => toggleLike(song.id)}
                  className={
                    liked
                      ? "text-[#1DB954]"
                      : "text-zinc-500 hover:text-white"
                  }
                  title={liked ? "Unlike" : "Like"}
                >
                  <HeartIcon className="h-4 w-4" filled={liked} />
                </button>

                {downloaded ? (
                  <button
                    onClick={() => removeDownload(song.id)}
                    className="text-[#1DB954] hover:text-red-400"
                    title="Downloaded — click to remove"
                  >
                    <CheckCircleIcon className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => downloadSong(song).catch(() => {})}
                    disabled={downloading}
                    className="text-zinc-500 hover:text-white disabled:animate-pulse disabled:text-[#1DB954]"
                    title="Download for offline listening"
                  >
                    <DownloadIcon className="h-4 w-4" />
                  </button>
                )}

                <button
                  onClick={() =>
                    setMenuSongId(menuSongId === song.id ? null : song.id)
                  }
                  className="text-zinc-500 hover:text-white"
                  title="Add to playlist"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>

                {showRemove && (
                  <button
                    onClick={() => showRemove(song)}
                    className="text-zinc-500 hover:text-red-400"
                    title="Remove from playlist"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}

                {menuSongId === song.id && (
                  <div className="absolute right-0 top-8 z-40 w-52 rounded-lg border border-zinc-700 bg-zinc-900 p-1 shadow-xl">
                    <p className="px-3 py-1.5 text-xs font-bold uppercase text-zinc-500">
                      Add to playlist
                    </p>
                    {editablePlaylists.length === 0 && (
                      <p className="px-3 py-1.5 text-xs text-zinc-400">
                        Create a playlist from the sidebar first.
                      </p>
                    )}
                    {editablePlaylists.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleAdd(p.id, song.id)}
                        className="block w-full truncate rounded px-3 py-1.5 text-left text-sm text-white hover:bg-zinc-800"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="hidden text-right text-sm tabular-nums text-zinc-400 md:block">
                {formatDuration(song.durationSec)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
