import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { songs } from "@/db/schema";
import { getTrack as getDeezerTrack } from "@/lib/deezer";

// Proxies the remote audio file through our server so the browser can
// store it in IndexedDB for offline playback without CORS issues.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = Number((await params).id);
  const [song] = await db.select().from(songs).where(eq(songs.id, id));
  if (!song) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  let audioUrl = song.audioUrl;
  let upstream = await fetch(audioUrl);
  // Deezer preview URLs are signed and can expire — refresh and retry once.
  if (!upstream.ok && song.externalId) {
    const fresh = await getDeezerTrack(song.externalId);
    if (fresh?.preview) {
      audioUrl = fresh.preview;
      await db
        .update(songs)
        .set({ audioUrl })
        .where(eq(songs.id, song.id));
      upstream = await fetch(audioUrl);
    }
  }
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: "Failed to fetch audio" },
      { status: 502 }
    );
  }
  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "audio/mpeg",
      "Cache-Control": "public, max-age=86400",
      ...(upstream.headers.get("Content-Length")
        ? { "Content-Length": upstream.headers.get("Content-Length")! }
        : {}),
    },
  });
}
