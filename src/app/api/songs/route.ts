import { NextRequest, NextResponse } from "next/server";
import { asc, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { songs } from "@/db/schema";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const rows = q
    ? await db
        .select()
        .from(songs)
        .where(
          or(
            ilike(songs.title, `%${q}%`),
            ilike(songs.artist, `%${q}%`),
            ilike(songs.album, `%${q}%`),
            ilike(songs.genre, `%${q}%`)
          )
        )
        .orderBy(asc(songs.id))
    : await db.select().from(songs).orderBy(asc(songs.id));
  return NextResponse.json(rows);
}
