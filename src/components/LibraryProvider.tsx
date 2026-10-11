"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Playlist, Song } from "@/lib/types";
import { deleteTrack, getAllTracks, saveTrack } from "@/lib/offline";

type LibraryContextValue = {
  likedIds: Set<number>;
  toggleLike: (songId: number) => Promise<void>;
  playlists: Playlist[];
  refreshPlaylists: () => Promise<void>;
  createPlaylist: (name: string) => Promise<Playlist | null>;
  addToPlaylist: (playlistId: number, songId: number) => Promise<void>;
  downloadedIds: Set<number>;
  downloadingIds: Set<number>;
  downloadSong: (song: Song) => Promise<void>;
  removeDownload: (songId: number) => Promise<void>;
  isOnline: boolean;
};

const LibraryContext = createContext<LibraryContextValue | null>(null);

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within LibraryProvider");
  return ctx;
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [downloadedIds, setDownloadedIds] = useState<Set<number>>(new Set());
  const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set());
  const [isOnline, setIsOnline] = useState(true);

  const refreshPlaylists = useCallback(async () => {
    try {
      const res = await fetch("/api/playlists");
      if (res.ok) setPlaylists((await res.json()) as Playlist[]);
    } catch {
      // offline
    }
  }, []);

  useEffect(() => {
    void refreshPlaylists();
    fetch("/api/likes")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: Song[]) => setLikedIds(new Set(rows.map((s) => s.id))))
      .catch(() => {});
    getAllTracks()
      .then((tracks) => setDownloadedIds(new Set(tracks.map((t) => t.id))))
      .catch(() => {});
    setIsOnline(navigator.onLine);
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, [refreshPlaylists]);

  const toggleLike = useCallback(async (songId: number) => {
    setLikedIds((prev) => {
      const nextSet = new Set(prev);
      if (nextSet.has(songId)) nextSet.delete(songId);
      else nextSet.add(songId);
      return nextSet;
    });
    try {
      await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId }),
      });
    } catch {
      // keep optimistic state
    }
  }, []);

  const createPlaylist = useCallback(
    async (name: string) => {
      try {
        const res = await fetch("/api/playlists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
        if (!res.ok) return null;
        const created = (await res.json()) as Playlist;
        await refreshPlaylists();
        return created;
      } catch {
        return null;
      }
    },
    [refreshPlaylists]
  );

  const addToPlaylist = useCallback(
    async (playlistId: number, songId: number) => {
      await fetch(`/api/playlists/${playlistId}/songs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId }),
      });
      await refreshPlaylists();
    },
    [refreshPlaylists]
  );

  const downloadSong = useCallback(async (song: Song) => {
    setDownloadingIds((prev) => new Set(prev).add(song.id));
    try {
      const res = await fetch(`/api/download/${song.id}`);
      if (!res.ok) throw new Error("download failed");
      const blob = await res.blob();
      await saveTrack(song, blob);
      setDownloadedIds((prev) => new Set(prev).add(song.id));
    } finally {
      setDownloadingIds((prev) => {
        const nextSet = new Set(prev);
        nextSet.delete(song.id);
        return nextSet;
      });
    }
  }, []);

  const removeDownload = useCallback(async (songId: number) => {
    await deleteTrack(songId);
    setDownloadedIds((prev) => {
      const nextSet = new Set(prev);
      nextSet.delete(songId);
      return nextSet;
    });
  }, []);

  const value = useMemo<LibraryContextValue>(
    () => ({
      likedIds,
      toggleLike,
      playlists,
      refreshPlaylists,
      createPlaylist,
      addToPlaylist,
      downloadedIds,
      downloadingIds,
      downloadSong,
      removeDownload,
      isOnline,
    }),
    [
      likedIds,
      toggleLike,
      playlists,
      refreshPlaylists,
      createPlaylist,
      addToPlaylist,
      downloadedIds,
      downloadingIds,
      downloadSong,
      removeDownload,
      isOnline,
    ]
  );

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
}
