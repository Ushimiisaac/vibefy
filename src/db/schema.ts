import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const songs = pgTable(
  "songs",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    artist: text("artist").notNull(),
    album: text("album").notNull(),
    genre: text("genre").notNull(),
    coverUrl: text("cover_url").notNull(),
    audioUrl: text("audio_url").notNull(),
    durationSec: integer("duration_sec").notNull().default(0),
    // Deezer track id for songs imported from the global catalog.
    externalId: text("external_id"),
    // Deezer artist id so song rows can link to the artist page.
    artistExternalId: text("artist_external_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("songs_external_id_unique").on(t.externalId)]
);

export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  coverUrl: text("cover_url"),
  isCurated: integer("is_curated").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const playlistSongs = pgTable(
  "playlist_songs",
  {
    id: serial("id").primaryKey(),
    playlistId: integer("playlist_id")
      .notNull()
      .references(() => playlists.id, { onDelete: "cascade" }),
    songId: integer("song_id")
      .notNull()
      .references(() => songs.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
    addedAt: timestamp("added_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("playlist_song_unique").on(t.playlistId, t.songId)]
);

export const likedSongs = pgTable(
  "liked_songs",
  {
    id: serial("id").primaryKey(),
    songId: integer("song_id")
      .notNull()
      .references(() => songs.id, { onDelete: "cascade" }),
    likedAt: timestamp("liked_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("liked_song_unique").on(t.songId)]
);

export const plays = pgTable("plays", {
  id: serial("id").primaryKey(),
  songId: integer("song_id")
    .notNull()
    .references(() => songs.id, { onDelete: "cascade" }),
  playedAt: timestamp("played_at").notNull().defaultNow(),
});
