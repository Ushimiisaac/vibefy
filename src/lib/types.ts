export type Song = {
  id: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  coverUrl: string;
  audioUrl: string;
  durationSec: number;
  externalId?: string | null;
  artistExternalId?: string | null;
};

export type ArtistSummary = {
  id: string;
  name: string;
  picture: string;
  fans: number | null;
};

export function formatFans(n: number | null): string {
  if (!n) return "";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M fans`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K fans`;
  return `${n} fans`;
}

export type Playlist = {
  id: number;
  name: string;
  description: string;
  coverUrl: string | null;
  isCurated: number;
  songCount?: number;
};

export type PlaylistWithSongs = Playlist & { songs: Song[] };

export function formatDuration(sec: number): string {
  if (!sec || Number.isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
