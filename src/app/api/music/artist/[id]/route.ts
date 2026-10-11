import { NextRequest, NextResponse } from "next/server";
import {
  getArtist,
  getArtistTopTracks,
  upsertDeezerTracks,
} from "@/lib/deezer";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [artist, tracks] = await Promise.all([
    getArtist(id),
    getArtistTopTracks(id, 25),
  ]);
  if (!artist) {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 });
  }
  const imported = await upsertDeezerTracks(tracks);
  return NextResponse.json({
    artist: {
      id: String(artist.id),
      name: artist.name,
      picture: artist.picture_xl || artist.picture_big,
      fans: artist.nb_fan ?? null,
    },
    songs: imported,
  });
}
