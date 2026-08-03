import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const teamTable = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position"),
  bio: text("bio"),
  photo: text("photo"),
  email: text("email"),
  phone: text("phone"),
  linkedin: text("linkedin"),
  facebook: text("facebook"),
  instagram: text("instagram"),
  order: integer("order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type TeamMember = typeof teamTable.$inferSelect;
