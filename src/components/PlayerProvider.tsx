"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Song } from "@/lib/types";
import { getTrack } from "@/lib/offline";

type RepeatMode = "off" | "all" | "one";

type PlayerContextValue = {
  current: Song | null;
  queue: Song[];
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;
  playingOffline: boolean;
  playQueue: (songs: Song[], startIndex: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (sec: number) => void;
  setVolume: (v: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [index, setIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.9);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("off");
  const [playingOffline, setPlayingOffline] = useState(false);

  const current = index >= 0 && index < queue.length ? queue[index] : null;

  // Keep latest values in refs for the audio "ended" handler.
  const stateRef = useRef({ queue, index, shuffle, repeat });
  stateRef.current = { queue, index, shuffle, repeat };

  const getAudio = useCallback(() => {
    if (!audioRef.current && typeof window !== "undefined") {
      const a = new Audio();
      a.preload = "metadata";
      audioRef.current = a;
    }
    return audioRef.current;
  }, []);

  const loadAndPlay = useCallback(
    async (song: Song) => {
      const audio = getAudio();
      if (!audio) return;
      // Prefer the offline copy if the user downloaded this track.
      let src = song.audioUrl;
      let offline = false;
      try {
        const track = await getTrack(song.id);
        if (track) {
          if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
          blobUrlRef.current = URL.createObjectURL(track.blob);
          src = blobUrlRef.current;
          offline = true;
        }
      } catch {
        // IndexedDB unavailable — stream instead.
      }
      setPlayingOffline(offline);
      audio.src = src;
      audio.volume = volume;
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      // Record the play for "Recently played" (fire and forget).
      fetch("/api/plays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId: song.id }),
      }).catch(() => {});
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: song.title,
          artist: song.artist,
          album: song.album,
          artwork: [{ src: song.coverUrl, sizes: "512x512" }],
        });
      }
    },
    [getAudio, volume]
  );

  const playAt = useCallback(
    (songs: Song[], i: number) => {
      if (i < 0 || i >= songs.length) return;
      setQueue(songs);
      setIndex(i);
      setProgress(0);
      void loadAndPlay(songs[i]);
    },
    [loadAndPlay]
  );

  const pickNextIndex = useCallback((dir: 1 | -1) => {
    const { queue: q, index: i, shuffle: sh, repeat: rp } = stateRef.current;
    if (q.length === 0) return -1;
    if (sh && q.length > 1) {
      let n = i;
      while (n === i) n = Math.floor(Math.random() * q.length);
      return n;
    }
    const n = i + dir;
    if (n >= q.length) return rp === "all" ? 0 : -1;
    if (n < 0) return rp === "all" ? q.length - 1 : 0;
    return n;
  }, []);

  const next = useCallback(() => {
    const n = pickNextIndex(1);
    if (n === -1) {
      setIsPlaying(false);
      return;
    }
    playAt(stateRef.current.queue, n);
  }, [pickNextIndex, playAt]);

  const prev = useCallback(() => {
    const audio = getAudio();
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    const n = pickNextIndex(-1);
    if (n !== -1) playAt(stateRef.current.queue, n);
  }, [getAudio, pickNextIndex, playAt]);

  useEffect(() => {
    const audio = getAudio();
    if (!audio) return;
    const onTime = () => setProgress(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      if (stateRef.current.repeat === "one") {
        audio.currentTime = 0;
        void audio.play();
        return;
      }
      const n = (() => {
        const { queue: q, index: i, shuffle: sh, repeat: rp } =
          stateRef.current;
        if (q.length === 0) return -1;
        if (sh && q.length > 1) {
          let x = i;
          while (x === i) x = Math.floor(Math.random() * q.length);
          return x;
        }
        const x = i + 1;
        if (x >= q.length) return rp === "all" ? 0 : -1;
        return x;
      })();
      if (n === -1) {
        setIsPlaying(false);
        return;
      }
      setIndex(n);
      setProgress(0);
      void loadAndPlay(stateRef.current.queue[n]);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnded);
    };
  }, [getAudio, loadAndPlay]);

  const togglePlay = useCallback(() => {
    const audio = getAudio();
    if (!audio || !current) return;
    if (audio.paused) {
      void audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [getAudio, current]);

  const seek = useCallback(
    (sec: number) => {
      const audio = getAudio();
      if (!audio) return;
      audio.currentTime = sec;
      setProgress(sec);
    },
    [getAudio]
  );

  const setVolume = useCallback(
    (v: number) => {
      setVolumeState(v);
      const audio = getAudio();
      if (audio) audio.volume = v;
    },
    [getAudio]
  );

  const value = useMemo<PlayerContextValue>(
    () => ({
      current,
      queue,
      isPlaying,
      progress,
      duration,
      volume,
      shuffle,
      repeat,
      playingOffline,
      playQueue: playAt,
      togglePlay,
      next,
      prev,
      seek,
      setVolume,
      toggleShuffle: () => setShuffle((s) => !s),
      cycleRepeat: () =>
        setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off")),
    }),
    [
      current,
      queue,
      isPlaying,
      progress,
      duration,
      volume,
      shuffle,
      repeat,
      playingOffline,
      playAt,
      togglePlay,
      next,
      prev,
      seek,
      setVolume,
    ]
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}
