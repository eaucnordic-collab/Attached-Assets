import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, siteContentTable } from "@workspace/db";

const router: IRouter = Router();
const CONTENT_KEY = "main";

router.get("/site-content", async (_req, res): Promise<void> => {
  try {
    const [row] = await db
      .select()
      .from(siteContentTable)
      .where(eq(siteContentTable.key, CONTENT_KEY));

    if (!row) {
      res.status(404).json({ error: "No content stored yet" });
      return;
    }

    res.setHeader("Content-Type", "application/json");
    res.send(row.value);
  } catch (err) {
    res.status(500).json({ error: "Failed to load content" });
  }
});

router.put("/site-content", async (req, res): Promise<void> => {
  try {
    const value = JSON.stringify(req.body);

    const [existing] = await db
      .select()
      .from(siteContentTable)
      .where(eq(siteContentTable.key, CONTENT_KEY));

    if (existing) {
      await db
        .update(siteContentTable)
        .set({ value })
        .where(eq(siteContentTable.key, CONTENT_KEY));
    } else {
      await db
        .insert(siteContentTable)
        .values({ key: CONTENT_KEY, value });
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save content" });
  }
});

export default router;
