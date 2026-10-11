import { NextRequest, NextResponse } from "next/server";
import { ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { songs } from "@/db/schema";
import { searchArtists, searchTracks, upsertDeezerTracks } from "@/lib/deezer";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ artists: [], songs: [] });
  }

  const [artists, tracks, localRows] = await Promise.all([
    searchArtists(q, 8),
    searchTracks(q, 20),
    db
      .select()
      .from(songs)
      .where(
        or(
          ilike(songs.title, `%${q}%`),
          ilike(songs.artist, `%${q}%`),
          ilike(songs.album, `%${q}%`)
        )
      )
      .limit(20),
  ]);

  // Import the global catalog hits so likes/playlists/downloads work on them.
  const imported = await upsertDeezerTracks(tracks);

  // Merge: local library tracks first, then global hits (no duplicates).
  const seen = new Set<number>();
  const merged = [...localRows.filter((r) => !r.externalId), ...imported].filter(
    (s) => {
      if (seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    }
  );

  return NextResponse.json({
    artists: artists.map((a) => ({
      id: String(a.id),
      name: a.name,
      picture: a.picture_big || a.picture_medium,
      fans: a.nb_fan ?? null,
    })),
    songs: merged,
  });
}
