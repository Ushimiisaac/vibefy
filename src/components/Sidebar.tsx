"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useLibrary } from "./LibraryProvider";
import {
  DownloadIcon,
  HeartIcon,
  HomeIcon,
  LibraryIcon,
  MusicIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
} from "./icons";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { playlists, createPlaylist, isOnline } = useLibrary();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  const navItem = (href: string, label: string, icon: React.ReactNode) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-4 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
          active ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
        }`}
      >
        {icon}
        <span className="hidden md:inline">{label}</span>
      </Link>
    );
  };

  async function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const created = await createPlaylist(trimmed);
    setName("");
    setCreating(false);
    if (created) router.push(`/playlist/${created.id}`);
  }

  return (
    <aside className="flex h-full w-16 shrink-0 flex-col gap-2 bg-black p-2 md:w-64">
      <div className="rounded-lg bg-zinc-900 p-3">
        <Link href="/" className="mb-4 flex items-center gap-2 px-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1DB954] text-black">
            <MusicIcon className="h-5 w-5" />
          </span>
          <span className="hidden text-xl font-black tracking-tight text-white md:inline">
            Vibefy
          </span>
        </Link>
        <nav className="flex flex-col gap-1">
          {navItem("/", "Home", <HomeIcon className="h-6 w-6" />)}
          {navItem("/search", "Search", <SearchIcon className="h-6 w-6" />)}
          {navItem(
            "/get-app",
            "Get the App",
            <PhoneIcon className="h-6 w-6" />
          )}
        </nav>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-lg bg-zinc-900 p-3">
        <div className="mb-2 flex items-center justify-between px-2">
          <span className="hidden items-center gap-2 text-sm font-semibold text-zinc-400 md:flex">
            <LibraryIcon className="h-5 w-5" /> Your Library
          </span>
          <button
            onClick={() => setCreating((c) => !c)}
            title="Create playlist"
            className="rounded-full p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>

        {creating && (
          <div className="mb-2 hidden gap-1 md:flex">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Playlist name"
              className="w-full rounded bg-zinc-800 px-2 py-1.5 text-sm text-white outline-none placeholder:text-zinc-500 focus:ring-1 focus:ring-[#1DB954]"
            />
            <button
              onClick={handleCreate}
              className="rounded bg-[#1DB954] px-2 text-xs font-bold text-black"
            >
              Add
            </button>
          </div>
        )}

        <nav className="flex flex-col gap-1">
          {navItem(
            "/liked",
            "Liked Songs",
            <span className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-indigo-500 to-[#1DB954] text-white">
              <HeartIcon className="h-3.5 w-3.5" filled />
            </span>
          )}
          {navItem(
            "/downloads",
            "Downloads",
            <span className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-emerald-500 to-teal-700 text-white">
              <DownloadIcon className="h-3.5 w-3.5" />
            </span>
          )}
        </nav>

        <div className="mt-3 hidden min-h-0 flex-1 overflow-y-auto md:block">
          {playlists.map((p) => (
            <Link
              key={p.id}
              href={`/playlist/${p.id}`}
              className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                pathname === `/playlist/${p.id}`
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span className="block truncate font-medium">{p.name}</span>
              <span className="block text-xs text-zinc-500">
                {p.isCurated ? "Curated" : "Playlist"} · {p.songCount ?? 0}{" "}
                songs
              </span>
            </Link>
          ))}
        </div>

        {!isOnline && (
          <div className="mt-2 hidden rounded-md bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-400 md:block">
            Offline mode — playing downloaded music
          </div>
        )}
      </div>
    </aside>
  );
}
