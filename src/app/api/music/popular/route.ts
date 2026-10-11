import { NextResponse } from "next/server";
import { getChartArtists, searchArtists } from "@/lib/deezer";

// Popular artists for the Home page: global chart toppers plus
// Afrobeats favourites so artists like Asake and Burna Boy show up.
const FEATURED = ["Asake", "Burna Boy", "Wizkid", "Davido", "Rema", "Ayra Starr"];

export async function GET() {
  const [chart, ...featured] = await Promise.all([
    getChartArtists(10),
    ...FEATURED.map((name) => searchArtists(name, 1)),
  ]);
  const seen = new Set<number>();
  const merged = [...featured.flat(), ...chart].filter((a) => {
    if (!a || seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });
  return NextResponse.json(
    merged.slice(0, 12).map((a) => ({
      id: String(a.id),
      name: a.name,
      picture: a.picture_big || a.picture_medium,
      fans: a.nb_fan ?? null,
    }))
  );
}
