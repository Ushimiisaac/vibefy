"use client";

import { useEffect, useState } from "react";
import type { Song } from "@/lib/types";
import { getAllTracks, type OfflineTrack } from "@/lib/offline";
import SongTable from "@/components/SongTable";
import { usePlayer } from "@/components/PlayerProvider";
import { useLibrary } from "@/components/LibraryProvider";
import { DownloadIcon, PlayIcon } from "@/components/icons";

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DownloadsPage() {
  const [tracks, setTracks] = useState<OfflineTrack[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { playQueue } = usePlayer();
  const { downloadedIds, isOnline } = useLibrary();

  useEffect(() => {
    getAllTracks()
      .then((t) => {
        setTracks(t.sort((a, b) => b.savedAt - a.savedAt));
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [downloadedIds]);

  const songs: Song[] = tracks
    .filter((t) => downloadedIds.has(t.id))
    .map((t) => t.song);
  const totalBytes = tracks
    .filter((t) => downloadedIds.has(t.id))
    .reduce((sum, t) => sum + t.blob.size, 0);

  return (
    <div>
      <div className="flex items-end gap-6 bg-gradient-to-b from-emerald-800/70 to-transparent p-6 pb-8 md:p-8">
        <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 shadow-2xl md:h-48 md:w-48">
          <DownloadIcon className="h-16 w-16 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest">
            Offline library
          </p>
          <h1 className="mb-2 text-4xl font-black tracking-tight md:text-6xl">
            Downloads
          </h1>
          <p className="text-sm text-zinc-300">
            {songs.length} songs · {formatBytes(totalBytes)} stored on this
            device
            {!isOnline && (
              <span className="ml-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-400">
                You're offline — these still play!
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="p-6 pt-0">
        {songs.length > 0 && (
          <button
            onClick={() => playQueue(songs, 0)}
            className="mb-6 flex items-center gap-2 rounded-full bg-[#1DB954] px-7 py-3 text-sm font-bold text-black transition hover:scale-105"
          >
            <PlayIcon className="h-4 w-4" /> Play offline
          </button>
        )}
        {loaded && songs.length === 0 ? (
          <div className="mt-10 text-center text-zinc-400">
            <p className="mb-2 font-semibold text-white">
              No downloads yet
            </p>
            <p className="text-sm">
              Tap the <DownloadIcon className="inline h-4 w-4" /> icon on any
              song to save it to this device and listen without internet —
              free, no Premium required.
            </p>
          </div>
        ) : (
          <SongTable songs={songs} />
        )}
      </div>
    </div>
  );
}
