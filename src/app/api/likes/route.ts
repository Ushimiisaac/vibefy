import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { likedSongs, songs } from "@/db/schema";

export async function GET() {
  const rows = await db
    .select({
      id: songs.id,
      title: songs.title,
      artist: songs.artist,
      album: songs.album,
      genre: songs.genre,
      coverUrl: songs.coverUrl,
      audioUrl: songs.audioUrl,
      durationSec: songs.durationSec,
      likedAt: likedSongs.likedAt,
    })
    .from(likedSongs)
    .innerJoin(songs, eq(likedSongs.songId, songs.id))
    .orderBy(desc(likedSongs.likedAt));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { songId?: number };
  const songId = Number(body.songId);
  if (!songId) {
    return NextResponse.json({ error: "songId required" }, { status: 400 });
  }
  const existing = await db
    .select()
    .from(likedSongs)
    .where(eq(likedSongs.songId, songId));
  if (existing.length > 0) {
    await db.delete(likedSongs).where(eq(likedSongs.songId, songId));
    return NextResponse.json({ liked: false });
  }
  await db.insert(likedSongs).values({ songId });
  return NextResponse.json({ liked: true });
}
