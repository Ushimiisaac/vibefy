import { NextRequest, NextResponse } from "next/server";
import { desc, eq, max, sql } from "drizzle-orm";
import { db } from "@/db";
import { plays, songs } from "@/db/schema";

export async function GET() {
  const lastPlayed = max(plays.playedAt);
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
      lastPlayed,
      playCount: sql<number>`count(*)::int`,
    })
    .from(plays)
    .innerJoin(songs, eq(plays.songId, songs.id))
    .groupBy(songs.id)
    .orderBy(desc(lastPlayed))
    .limit(10);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { songId?: number };
  const songId = Number(body.songId);
  if (!songId) {
    return NextResponse.json({ error: "songId required" }, { status: 400 });
  }
  await db.insert(plays).values({ songId });
  return NextResponse.json({ ok: true });
}
