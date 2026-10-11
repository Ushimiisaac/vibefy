import { NextRequest, NextResponse } from "next/server";
import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { playlists, playlistSongs } from "@/db/schema";

export async function GET() {
  const rows = await db
    .select({
      id: playlists.id,
      name: playlists.name,
      description: playlists.description,
      coverUrl: playlists.coverUrl,
      isCurated: playlists.isCurated,
      songCount: sql<number>`count(${playlistSongs.id})::int`,
    })
    .from(playlists)
    .leftJoin(playlistSongs, eq(playlistSongs.playlistId, playlists.id))
    .groupBy(playlists.id)
    .orderBy(asc(playlists.id));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { name?: string; description?: string };
  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "name required" }, { status: 400 });
  }
  const [created] = await db
    .insert(playlists)
    .values({ name, description: body.description?.trim() ?? "" })
    .returning();
  return NextResponse.json(created, { status: 201 });
}
