"use client";

/* eslint-disable @next/next/no-img-element */

import { usePlayer } from "./PlayerProvider";
import { useLibrary } from "./LibraryProvider";
import { formatDuration } from "@/lib/types";
import {
  CheckCircleIcon,
  HeartIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  RepeatIcon,
  ShuffleIcon,
  VolumeIcon,
} from "./icons";

export default function PlayerBar() {
  const {
    current,
    isPlaying,
    progress,
    duration,
    volume,
    shuffle,
    repeat,
    playingOffline,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    toggleShuffle,
    cycleRepeat,
  } = usePlayer();
  const { likedIds, toggleLike } = useLibrary();

  const liked = current ? likedIds.has(current.id) : false;
  const dur = duration || current?.durationSec || 0;

  return (
    <footer className="flex h-20 items-center justify-between gap-4 border-t border-zinc-800 bg-zinc-950 px-4">
      {/* Now playing */}
      <div className="flex w-1/3 min-w-0 items-center gap-3 md:w-1/4">
        {current ? (
          <>
            <img
              src={current.coverUrl}
              alt={current.album}
              className="h-12 w-12 rounded object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {current.title}
              </p>
              <p className="truncate text-xs text-zinc-400">
                {current.artist}
                {playingOffline && (
                  <span className="ml-2 inline-flex items-center gap-1 text-[#1DB954]">
                    <CheckCircleIcon className="h-3 w-3" /> offline
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() => toggleLike(current.id)}
              className={`shrink-0 transition ${
                liked ? "text-[#1DB954]" : "text-zinc-400 hover:text-white"
              }`}
              title={liked ? "Remove from Liked Songs" : "Save to Liked Songs"}
            >
              <HeartIcon className="h-4 w-4" filled={liked} />
            </button>
          </>
        ) : (
          <p className="text-sm text-zinc-500">
            Pick a song — everything is free 🎧
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex max-w-xl flex-1 flex-col items-center gap-1.5">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleShuffle}
            className={`hidden transition sm:block ${
              shuffle ? "text-[#1DB954]" : "text-zinc-400 hover:text-white"
            }`}
            title="Shuffle"
          >
            <ShuffleIcon className="h-4 w-4" />
          </button>
          <button
            onClick={prev}
            className="text-zinc-300 transition hover:text-white"
            title="Previous"
          >
            <PrevIcon className="h-5 w-5" />
          </button>
          <button
            onClick={togglePlay}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 disabled:opacity-40"
            disabled={!current}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <PauseIcon className="h-4.5 w-4.5" />
            ) : (
              <PlayIcon className="ml-0.5 h-4.5 w-4.5" />
            )}
          </button>
          <button
            onClick={next}
            className="text-zinc-300 transition hover:text-white"
            title="Next"
          >
            <NextIcon className="h-5 w-5" />
          </button>
          <button
            onClick={cycleRepeat}
            className={`relative hidden transition sm:block ${
              repeat !== "off"
                ? "text-[#1DB954]"
                : "text-zinc-400 hover:text-white"
            }`}
            title={`Repeat: ${repeat}`}
          >
            <RepeatIcon className="h-4 w-4" />
            {repeat === "one" && (
              <span className="absolute -right-1.5 -top-1 text-[9px] font-bold">
                1
              </span>
            )}
          </button>
        </div>
        <div className="flex w-full items-center gap-2">
          <span className="w-9 text-right text-[11px] tabular-nums text-zinc-400">
            {formatDuration(progress)}
          </span>
          <input
            type="range"
            min={0}
            max={dur || 1}
            step={0.5}
            value={Math.min(progress, dur)}
            onChange={(e) => seek(Number(e.target.value))}
            className="player-range h-1 w-full"
            style={{
              background: `linear-gradient(to right, #1DB954 ${
                dur ? (progress / dur) * 100 : 0
              }%, #3f3f46 0%)`,
            }}
          />
          <span className="w-9 text-[11px] tabular-nums text-zinc-400">
            {formatDuration(dur)}
          </span>
        </div>
      </div>

      {/* Volume */}
      <div className="hidden w-1/4 items-center justify-end gap-2 md:flex">
        <VolumeIcon className="h-4 w-4 text-zinc-400" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="player-range h-1 w-24"
          style={{
            background: `linear-gradient(to right, #fff ${
              volume * 100
            }%, #3f3f46 0%)`,
          }}
        />
      </div>
    </footer>
  );
}
