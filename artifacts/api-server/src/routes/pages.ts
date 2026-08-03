import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, pagesTable, blocksTable } from "@workspace/db";
import { serialize } from "../lib/serialize";
import {
  ListPagesResponse,
  CreatePageBody,
  CreatePageResponse,
  GetPageParams,
  GetPageResponse,
  UpdatePageParams,
  UpdatePageBody,
  UpdatePageResponse,
  DeletePageParams,
  PublishPageParams,
  PublishPageResponse,
  UnpublishPageParams,
  UnpublishPageResponse,
  DuplicatePageParams,
  DuplicatePageResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/pages", async (req, res): Promise<void> => {
  const status = req.query.status as string | undefined;
  let pages = await db.select().from(pagesTable).orderBy(asc(pagesTable.order));
  if (status && status !== "all") {
    pages = pages.filter((p) => p.status === status);
  }
  res.json(serialize(pages));

});

router.post("/pages", async (req, res): Promise<void> => {
  const parsed = CreatePageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const maxOrder = await db.select().from(pagesTable);
  const order = maxOrder.length;
  const [page] = await db
    .insert(pagesTable)
    .values({ ...parsed.data, order })
    .returning();
  res.status(201).json(serialize(page));

});

router.get("/pages/:id", async (req, res): Promise<void> => {
  const params = GetPageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [page] = await db.select().from(pagesTable).where(eq(pagesTable.id, params.data.id));
  if (!page) {
    res.status(404).json({ error: "Page not found" });
    return;
  }
  const blocks = await db
    .select()
    .from(blocksTable)
    .where(eq(blocksTable.pageId, page.id))
    .orderBy(asc(blocksTable.order));
  res.json(serialize({ ...page, blocks }));

});

router.patch("/pages/:id", async (req, res): Promise<void> => {
  const params = UpdatePageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdatePageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [page] = await db
    .update(pagesTable)
    .set(parsed.data)
    .where(eq(pagesTable.id, params.data.id))
    .returning();
  if (!page) {
    res.status(404).json({ error: "Page not found" });
    return;
  }
  res.json(serialize(page));

});

router.delete("/pages/:id", async (req, res): Promise<void> => {
  const params = DeletePageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(pagesTable).where(eq(pagesTable.id, params.data.id));
  res.sendStatus(204);
});

router.post("/pages/:id/publish", async (req, res): Promise<void> => {
  const params = PublishPageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [page] = await db
    .update(pagesTable)
    .set({ status: "published", publishedAt: new Date() })
    .where(eq(pagesTable.id, params.data.id))
    .returning();
  if (!page) {
    res.status(404).json({ error: "Page not found" });
    return;
  }
  res.json(serialize(page));

});

router.post("/pages/:id/unpublish", async (req, res): Promise<void> => {
  const params = UnpublishPageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [page] = await db
    .update(pagesTable)
    .set({ status: "draft", publishedAt: null })
    .where(eq(pagesTable.id, params.data.id))
    .returning();
  if (!page) {
    res.status(404).json({ error: "Page not found" });
    return;
  }
  res.json(serialize(page));

});

router.post("/pages/:id/duplicate", async (req, res): Promise<void> => {
  const params = DuplicatePageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [orig] = await db.select().from(pagesTable).where(eq(pagesTable.id, params.data.id));
  if (!orig) {
    res.status(404).json({ error: "Page not found" });
    return;
  }
  const all = await db.select().from(pagesTable);
  const [dup] = await db
    .insert(pagesTable)
    .values({
      title: orig.title + " (Copy)",
      slug: orig.slug + "-copy-" + Date.now(),
      status: "draft",
      order: all.length,
      isHome: false,
      showInMenu: orig.showInMenu,
    })
    .returning();
  // Copy blocks
  const origBlocks = await db.select().from(blocksTable).where(eq(blocksTable.pageId, orig.id));
  for (const block of origBlocks) {
    await db.insert(blocksTable).values({
      pageId: dup.id,
      type: block.type,
      order: block.order,
      visible: block.visible,
      content: block.content as Record<string, unknown>,
      styles: block.styles as Record<string, unknown>,
      translations: block.translations as Record<string, unknown>,
      responsiveSettings: block.responsiveSettings as Record<string, unknown>,
    });
  }
  res.status(201).json(serialize(dup));

});

export default router;
