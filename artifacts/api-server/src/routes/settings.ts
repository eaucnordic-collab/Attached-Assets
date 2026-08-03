import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, siteSettingsTable, themeSettingsTable } from "@workspace/db";
import { serialize } from "../lib/serialize";
import {
  GetSettingsResponse,
  UpdateSettingsBody,
  UpdateSettingsResponse,
  GetThemeResponse,
  UpdateThemeBody,
  UpdateThemeResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function getOrCreateSettings() {
  const [settings] = await db.select().from(siteSettingsTable);
  if (settings) return settings;
  const [created] = await db.insert(siteSettingsTable).values({ siteName: "EAUC Nordic" }).returning();
  return created;
}

async function getOrCreateTheme() {
  const [theme] = await db.select().from(themeSettingsTable);
  if (theme) return theme;
  const [created] = await db.insert(themeSettingsTable).values({}).returning();
  return created;
}

router.get("/settings", async (_req, res): Promise<void> => {
  const settings = await getOrCreateSettings();
  res.json(serialize(settings));

});

router.patch("/settings", async (req, res): Promise<void> => {
  const parsed = UpdateSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const settings = await getOrCreateSettings();
  const [updated] = await db
    .update(siteSettingsTable)
    .set(parsed.data)
    .where(eq(siteSettingsTable.id, settings.id))
    .returning();
  res.json(serialize(updated));

});

router.get("/settings/theme", async (_req, res): Promise<void> => {
  const theme = await getOrCreateTheme();
  res.json(serialize(theme));

});

router.patch("/settings/theme", async (req, res): Promise<void> => {
  const parsed = UpdateThemeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const theme = await getOrCreateTheme();
  const [updated] = await db
    .update(themeSettingsTable)
    .set(parsed.data)
    .where(eq(themeSettingsTable.id, theme.id))
    .returning();
  res.json(serialize(updated));

});

export default router;
