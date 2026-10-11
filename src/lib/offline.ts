"use client";

import type { Song } from "./types";

export type OfflineTrack = {
  id: number;
  song: Song;
  blob: Blob;
  savedAt: number;
};

const DB_NAME = "vibefy-offline";
const STORE = "tracks";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveTrack(song: Song, blob: Blob): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put({
      id: song.id,
      song,
      blob,
      savedAt: Date.now(),
    } satisfies OfflineTrack);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getTrack(id: number): Promise<OfflineTrack | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, "readonly").objectStore(STORE).get(id);
    req.onsuccess = () => resolve((req.result as OfflineTrack) ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllTracks(): Promise<OfflineTrack[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, "readonly").objectStore(STORE).getAll();
    req.onsuccess = () => resolve((req.result as OfflineTrack[]) ?? []);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteTrack(id: number): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
