import { pgTable, serial, text, boolean, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const blocksTable = pgTable("blocks", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").notNull(),
  type: text("type").notNull(),
  order: integer("order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  content: jsonb("content").notNull().default({}),
  styles: jsonb("styles").notNull().default({}),
  translations: jsonb("translations").notNull().default({}),
  responsiveSettings: jsonb("responsive_settings").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type Block = typeof blocksTable.$inferSelect;
