import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const newsTable = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  coverImage: text("cover_image"),
  galleryImages: text("gallery_images").array().notNull().default([]),
  author: text("author"),
  category: text("category"),
  language: text("language").notNull().default("da"),
  translationGroup: text("translation_group").notNull().default(""),
  tags: text("tags").array().notNull().default([]),
  status: text("status").notNull().default("draft"),
  pinned: boolean("pinned").notNull().default(false),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type NewsPost = typeof newsTable.$inferSelect;
