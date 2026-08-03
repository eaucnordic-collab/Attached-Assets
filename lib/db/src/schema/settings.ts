import { pgTable, serial, text, boolean, integer, jsonb, timestamp } from "drizzle-orm/pg-core";

export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  siteName: text("site_name").notNull().default("EAUC Nordic"),
  siteDescription: text("site_description"),
  logo: text("logo"),
  favicon: text("favicon"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  address: text("address"),
  socialLinks: jsonb("social_links").notNull().default({}),
  languages: text("languages").array().notNull().default(["en"]),
  defaultLanguage: text("default_language").notNull().default("en"),
  headerTransparent: boolean("header_transparent").notNull().default(false),
  headerFixed: boolean("header_fixed").notNull().default(true),
  footerColumns: integer("footer_columns").notNull().default(3),
  footerCopyright: text("footer_copyright"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const themeSettingsTable = pgTable("theme_settings", {
  id: serial("id").primaryKey(),
  preset: text("preset").notNull().default("eauc-nordic"),
  primaryColor: text("primary_color").notNull().default("#1a6b5a"),
  secondaryColor: text("secondary_color").notNull().default("#e8f5f2"),
  accentColor: text("accent_color").notNull().default("#2d9977"),
  backgroundColor: text("background_color").notNull().default("#ffffff"),
  textColor: text("text_color").notNull().default("#1a1f2e"),
  headingFont: text("heading_font").notNull().default("Inter"),
  bodyFont: text("body_font").notNull().default("Inter"),
  baseFontSize: text("base_font_size").notNull().default("16px"),
  containerWidth: text("container_width").notNull().default("1200px"),
  borderRadius: text("border_radius").notNull().default("8px"),
  buttonStyle: text("button_style").notNull().default("rounded"),
  cardStyle: text("card_style").notNull().default("shadow"),
  sectionSpacing: text("section_spacing").notNull().default("80px"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const auditLogTable = pgTable("audit_log", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  action: text("action").notNull(),
  userId: integer("user_id"),
  user: text("user"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type SiteSettings = typeof siteSettingsTable.$inferSelect;
export type ThemeSettings = typeof themeSettingsTable.$inferSelect;
export type AuditLog = typeof auditLogTable.$inferSelect;
