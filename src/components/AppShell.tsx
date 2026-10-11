"use client";

import { useEffect, type ReactNode } from "react";
import { LibraryProvider } from "./LibraryProvider";
import { PlayerProvider } from "./PlayerProvider";
import Sidebar from "./Sidebar";
import PlayerBar from "./PlayerBar";

export default function AppShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <LibraryProvider>
      <PlayerProvider>
        <div className="flex h-dvh flex-col bg-black text-white">
          <div className="flex min-h-0 flex-1 gap-2 p-2 pb-0">
            <Sidebar />
            <main className="min-w-0 flex-1 overflow-y-auto rounded-lg bg-gradient-to-b from-zinc-900 to-zinc-950">
              {children}
            </main>
          </div>
          <PlayerBar />
        </div>
      </PlayerProvider>
    </LibraryProvider>
  );
}
