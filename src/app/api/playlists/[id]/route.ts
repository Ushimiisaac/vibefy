import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { playlists, playlistSongs, songs } from "@/db/schema";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = Number((await params).id);
  const [playlist] = await db
    .select()
    .from(playlists)
    .where(eq(playlists.id, id));
  if (!playlist) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
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
    })
    .from(playlistSongs)
    .innerJoin(songs, eq(playlistSongs.songId, songs.id))
    .where(eq(playlistSongs.playlistId, id))
    .orderBy(asc(playlistSongs.position), asc(playlistSongs.id));
  return NextResponse.json({ ...playlist, songs: rows });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = Number((await params).id);
  const body = (await req.json()) as { name?: string; description?: string };
  const [updated] = await db
    .update(playlists)
    .set({
      ...(body.name ? { name: body.name.trim() } : {}),
      ...(body.description !== undefined
        ? { description: body.description }
        : {}),
    })
    .where(eq(playlists.id, id))
    .returning();
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = Number((await params).id);
  await db.delete(playlists).where(eq(playlists.id, id));
  return NextResponse.json({ ok: true });
}
