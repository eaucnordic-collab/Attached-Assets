import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const navItemsTable = pgTable("nav_items", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  url: text("url"),
  pageId: integer("page_id"),
  parentId: integer("parent_id"),
  order: integer("order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  openInNewTab: boolean("open_in_new_tab").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type NavItem = typeof navItemsTable.$inferSelect;
