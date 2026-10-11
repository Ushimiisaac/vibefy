import { NextRequest, NextResponse } from "next/server";
import { and, eq, max } from "drizzle-orm";
import { db } from "@/db";
import { playlistSongs } from "@/db/schema";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const playlistId = Number((await params).id);
  const body = (await req.json()) as { songId?: number };
  const songId = Number(body.songId);
  if (!songId) {
    return NextResponse.json({ error: "songId required" }, { status: 400 });
  }
  const existing = await db
    .select()
    .from(playlistSongs)
    .where(
      and(
        eq(playlistSongs.playlistId, playlistId),
        eq(playlistSongs.songId, songId)
      )
    );
  if (existing.length > 0) {
    return NextResponse.json({ ok: true, already: true });
  }
  const [row] = await db
    .select({ maxPos: max(playlistSongs.position) })
    .from(playlistSongs)
    .where(eq(playlistSongs.playlistId, playlistId));
  await db.insert(playlistSongs).values({
    playlistId,
    songId,
    position: (row?.maxPos ?? -1) + 1,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const playlistId = Number((await params).id);
  const songId = Number(req.nextUrl.searchParams.get("songId"));
  if (!songId) {
    return NextResponse.json({ error: "songId required" }, { status: 400 });
  }
  await db
    .delete(playlistSongs)
    .where(
      and(
        eq(playlistSongs.playlistId, playlistId),
        eq(playlistSongs.songId, songId)
      )
    );
  return NextResponse.json({ ok: true });
}
