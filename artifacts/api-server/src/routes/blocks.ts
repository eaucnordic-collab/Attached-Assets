import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, blocksTable } from "@workspace/db";
import { serialize } from "../lib/serialize";
import {
  ListBlocksParams,
  ListBlocksResponse,
  CreateBlockParams,
  CreateBlockBody,
  CreateBlockResponse,
  ReorderBlocksParams,
  ReorderBlocksBody,
  ReorderBlocksResponse,
  UpdateBlockParams,
  UpdateBlockBody,
  UpdateBlockResponse,
  DeleteBlockParams,
  DuplicateBlockParams,
  DuplicateBlockResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/pages/:pageId/blocks", async (req, res): Promise<void> => {
  const params = ListBlocksParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const blocks = await db
    .select()
    .from(blocksTable)
    .where(eq(blocksTable.pageId, params.data.pageId))
    .orderBy(asc(blocksTable.order));
  res.json(serialize(blocks));

});

router.post("/pages/:pageId/blocks", async (req, res): Promise<void> => {
  const params = CreateBlockParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = CreateBlockBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [block] = await db
    .insert(blocksTable)
    .values({
      pageId: params.data.pageId,
      type: parsed.data.type,
      order: parsed.data.order ?? 0,
      visible: parsed.data.visible ?? true,
      content: (parsed.data.content as Record<string, unknown>) ?? {},
      styles: (parsed.data.styles as Record<string, unknown>) ?? {},
      translations: (parsed.data.translations as Record<string, unknown>) ?? {},
      responsiveSettings: (parsed.data.responsiveSettings as Record<string, unknown>) ?? {},
    })
    .returning();
  res.status(201).json(serialize(block));

});

router.post("/pages/:pageId/blocks/reorder", async (req, res): Promise<void> => {
  const params = ReorderBlocksParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = ReorderBlocksBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { blockIds } = parsed.data;
  for (let i = 0; i < blockIds.length; i++) {
    await db.update(blocksTable).set({ order: i }).where(eq(blocksTable.id, blockIds[i]!));
  }
  const blocks = await db
    .select()
    .from(blocksTable)
    .where(eq(blocksTable.pageId, params.data.pageId))
    .orderBy(asc(blocksTable.order));
  res.json(serialize(blocks));

});

router.patch("/pages/:pageId/blocks/:blockId", async (req, res): Promise<void> => {
  const params = UpdateBlockParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateBlockBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updateData: Record<string, unknown> = {};
  if (parsed.data.type !== undefined) updateData.type = parsed.data.type;
  if (parsed.data.order !== undefined) updateData.order = parsed.data.order;
  if (parsed.data.visible !== undefined) updateData.visible = parsed.data.visible;
  if (parsed.data.content !== undefined) updateData.content = parsed.data.content;
  if (parsed.data.styles !== undefined) updateData.styles = parsed.data.styles;
  if (parsed.data.translations !== undefined) updateData.translations = parsed.data.translations;
  if (parsed.data.responsiveSettings !== undefined) updateData.responsiveSettings = parsed.data.responsiveSettings;

  const [block] = await db
    .update(blocksTable)
    .set(updateData)
    .where(eq(blocksTable.id, params.data.blockId))
    .returning();
  if (!block) {
    res.status(404).json({ error: "Block not found" });
    return;
  }
  res.json(serialize(block));

});

router.delete("/pages/:pageId/blocks/:blockId", async (req, res): Promise<void> => {
  const params = DeleteBlockParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(blocksTable).where(eq(blocksTable.id, params.data.blockId));
  res.sendStatus(204);
});

router.post("/pages/:pageId/blocks/:blockId/duplicate", async (req, res): Promise<void> => {
  const params = DuplicateBlockParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [orig] = await db.select().from(blocksTable).where(eq(blocksTable.id, params.data.blockId));
  if (!orig) {
    res.status(404).json({ error: "Block not found" });
    return;
  }
  const [dup] = await db
    .insert(blocksTable)
    .values({
      pageId: orig.pageId,
      type: orig.type,
      order: orig.order + 1,
      visible: orig.visible,
      content: orig.content as Record<string, unknown>,
      styles: orig.styles as Record<string, unknown>,
      translations: orig.translations as Record<string, unknown>,
      responsiveSettings: orig.responsiveSettings as Record<string, unknown>,
    })
    .returning();
  res.status(201).json(serialize(dup));

});

export default router;
