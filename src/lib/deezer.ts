import { inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { songs } from "@/db/schema";

const API = "https://api.deezer.com";

export type DeezerArtist = {
  id: number;
  name: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  nb_fan?: number;
};

export type DeezerTrack = {
  id: number;
  title: string;
  duration: number;
  preview: string;
  artist: { id: number; name: string };
  album: { title: string; cover_medium: string; cover_big: string };
};

async function dz<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: { Accept: "application/json" },
      // Deezer responses change often; don't let Next cache them for long.
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as T & { error?: unknown };
    if (json && typeof json === "object" && "error" in json && json.error) {
      return null;
    }
    return json;
  } catch {
    return null;
  }
}

export async function searchArtists(q: string, limit = 8) {
  const json = await dz<{ data: DeezerArtist[] }>(
    `/search/artist?q=${encodeURIComponent(q)}&limit=${limit}`
  );
  return json?.data ?? [];
}

export async function searchTracks(q: string, limit = 20) {
  const json = await dz<{ data: DeezerTrack[] }>(
    `/search?q=${encodeURIComponent(q)}&limit=${limit}`
  );
  return (json?.data ?? []).filter((t) => t.preview);
}

export async function getArtist(id: string) {
  return dz<DeezerArtist>(`/artist/${id}`);
}

export async function getArtistTopTracks(id: string, limit = 25) {
  const json = await dz<{ data: DeezerTrack[] }>(
    `/artist/${id}/top?limit=${limit}`
  );
  return (json?.data ?? []).filter((t) => t.preview);
}

export async function getChartArtists(limit = 12) {
  const json = await dz<{ data: DeezerArtist[] }>(
    `/chart/0/artists?limit=${limit}`
  );
  return json?.data ?? [];
}

export async function getTrack(id: string) {
  return dz<DeezerTrack>(`/track/${id}`);
}

/**
 * Upsert Deezer tracks into our songs table so likes, playlists and offline
 * downloads work with stable local ids. Returns local rows in input order.
 */
export async function upsertDeezerTracks(tracks: DeezerTrack[]) {
  if (tracks.length === 0) return [];
  const values = tracks.map((t) => ({
    title: t.title,
    artist: t.artist.name,
    album: t.album?.title ?? t.artist.name,
    genre: "",
    coverUrl: t.album?.cover_big || t.album?.cover_medium || "",
    audioUrl: t.preview,
    durationSec: t.duration,
    externalId: String(t.id),
    artistExternalId: String(t.artist.id),
  }));
  await db
    .insert(songs)
    .values(values)
    .onConflictDoUpdate({
      target: songs.externalId,
      set: {
        // Preview URLs are signed and expire — refresh them on every sync.
        audioUrl: sql`excluded.audio_url`,
        coverUrl: sql`excluded.cover_url`,
      },
    });
  const ids = tracks.map((t) => String(t.id));
  const rows = await db
    .select()
    .from(songs)
    .where(inArray(songs.externalId, ids));
  const byExternal = new Map(rows.map((r) => [r.externalId, r]));
  return ids
    .map((id) => byExternal.get(id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));
}
