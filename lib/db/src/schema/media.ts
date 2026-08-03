import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const mediaTable = pgTable("media_items", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  url: text("url").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  altText: text("alt_text"),
  category: text("category"),
  width: integer("width"),
  height: integer("height"),
  data: text("data"), // base64 for local storage
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type MediaItem = typeof mediaTable.$inferSelect;
