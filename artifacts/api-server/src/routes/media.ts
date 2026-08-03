import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, mediaTable } from "@workspace/db";
import { serialize } from "../lib/serialize";
import {
  ListMediaResponse,
  CreateMediaItemBody,
  CreateMediaItemResponse,
  UpdateMediaItemParams,
  UpdateMediaItemBody,
  UpdateMediaItemResponse,
  DeleteMediaItemParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/media", async (req, res): Promise<void> => {
  const category = req.query.category as string | undefined;
  const search = req.query.search as string | undefined;
  let items = await db.select().from(mediaTable).orderBy(desc(mediaTable.createdAt));
  if (category) {
    items = items.filter((m) => m.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (m) =>
        m.filename.toLowerCase().includes(q) ||
        m.originalName.toLowerCase().includes(q)
    );
  }
  // Strip base64 data from list response for performance
  const sanitized = items.map(({ data: _data, ...rest }) => rest);
  res.json(serialize(sanitized));

});

router.post("/media", async (req, res): Promise<void> => {
  const parsed = CreateMediaItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  let url = parsed.data.url;
  // If data is provided (base64), store it and use a data URL
  if (parsed.data.data && !url.startsWith("data:")) {
    url = `data:${parsed.data.mimeType};base64,${parsed.data.data}`;
  }
  const [item] = await db
    .insert(mediaTable)
    .values({
      filename: parsed.data.filename,
      originalName: parsed.data.originalName || parsed.data.filename,
      url,
      mimeType: parsed.data.mimeType,
      size: parsed.data.size,
      altText: parsed.data.altText ?? null,
      category: parsed.data.category ?? null,
      width: parsed.data.width ?? null,
      height: parsed.data.height ?? null,
      data: parsed.data.data ?? null,
    })
    .returning();
  const { data: _data, ...rest } = item;
  res.status(201).json(serialize(rest));

});

router.patch("/media/:id", async (req, res): Promise<void> => {
  const params = UpdateMediaItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateMediaItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db
    .update(mediaTable)
    .set(parsed.data)
    .where(eq(mediaTable.id, params.data.id))
    .returning();
  if (!item) {
    res.status(404).json({ error: "Media item not found" });
    return;
  }
  const { data: _data, ...rest } = item;
  res.json(serialize(rest));

});

router.delete("/media/:id", async (req, res): Promise<void> => {
  const params = DeleteMediaItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(mediaTable).where(eq(mediaTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
