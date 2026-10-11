"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { CheckCircleIcon, PhoneIcon } from "@/components/icons";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const FEATURES = [
  "Ad-free listening — zero interruptions",
  "Unlimited skips & on-demand playback",
  "Download songs and play them offline",
  "Highest audio quality streaming",
  "Unlimited playlists & Liked Songs",
  "Free forever on Android and iPhone",
];

export default function GetAppPage() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
    }
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <img
            src="/icons/icon-512.png"
            alt="Vibefy"
            className="mx-auto mb-5 h-24 w-24 rounded-3xl shadow-2xl shadow-[#1DB954]/20"
          />
          <h1 className="mb-3 text-4xl font-black tracking-tight md:text-5xl">
            Vibefy on your phone.{" "}
            <span className="text-[#1DB954]">Free. Forever.</span>
          </h1>
          <p className="mx-auto max-w-xl text-zinc-300">
            Every premium feature unlocked for all Android and iPhone users —
            no subscription, no trial, no credit card. Install the app and
            take your music everywhere, even without internet.
          </p>
        </div>

        {/* Store badges */}
        <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={install}
            className="flex w-64 items-center gap-3 rounded-xl border border-zinc-600 bg-black px-5 py-3 text-left transition hover:border-white"
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
              <path d="M4 3.5v17c0 .6.66.98 1.18.66l14.5-8.5a.77.77 0 0 0 0-1.32L5.18 2.84A.77.77 0 0 0 4 3.5Z" fill="#1DB954" />
            </svg>
            <span>
              <span className="block text-[10px] uppercase tracking-wide text-zinc-400">
                Free for Android — get it on
              </span>
              <span className="block text-lg font-bold">Google Play</span>
            </span>
          </button>
          <button
            onClick={install}
            className="flex w-64 items-center gap-3 rounded-xl border border-zinc-600 bg-black px-5 py-3 text-left transition hover:border-white"
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
              <path d="M16.6 12.9c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8-.7 0-1.9-.8-3.1-.8-1.6 0-3 .9-3.8 2.3-1.6 2.9-.4 7.1 1.2 9.4.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3.1.7c1.3 0 2.1-1.1 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.5-1-2.6-3.7ZM14.3 5.6c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.2 1.9-1 3 1 .1 2.1-.6 2.7-1.4Z" />
            </svg>
            <span>
              <span className="block text-[10px] uppercase tracking-wide text-zinc-400">
                Free for iPhone — download on the
              </span>
              <span className="block text-lg font-bold">App Store</span>
            </span>
          </button>
        </div>

        {installed ? (
          <div className="mb-10 rounded-xl bg-[#1DB954]/15 p-5 text-center font-semibold text-[#1DB954]">
            ✓ Vibefy is installed on this device. Open it from your home
            screen!
          </div>
        ) : installEvent ? (
          <div className="mb-10 text-center">
            <button
              onClick={install}
              className="rounded-full bg-[#1DB954] px-10 py-3.5 text-base font-bold text-black transition hover:scale-105"
            >
              Install Vibefy on this device now
            </button>
          </div>
        ) : (
          <div className="mb-10 rounded-xl bg-zinc-800/60 p-5 text-sm text-zinc-300">
            <p className="mb-2 flex items-center gap-2 font-bold text-white">
              <PhoneIcon className="h-4 w-4" /> How to install on this device
            </p>
            {isIos ? (
              <p>
                On iPhone: open this page in <b>Safari</b>, tap the{" "}
                <b>Share</b> button, then choose{" "}
                <b>“Add to Home Screen”</b>. Vibefy installs instantly as a
                full-screen app — completely free.
              </p>
            ) : (
              <p>
                On Android: open this page in <b>Chrome</b>, tap the{" "}
                <b>⋮ menu</b>, then choose <b>“Install app”</b> (or “Add to
                Home screen”). Vibefy installs instantly — completely free.
              </p>
            )}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f}
              className="flex items-center gap-3 rounded-lg bg-zinc-800/50 px-4 py-3"
            >
              <CheckCircleIcon className="h-5 w-5 shrink-0 text-[#1DB954]" />
              <span className="text-sm font-medium">{f}</span>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-zinc-500">
          Vibefy ships as an installable progressive web app, so the same
          free experience works on Google Play–certified Android devices and
          every iPhone — no account or payment ever required.
        </p>
      </div>
    </div>
  );
}
