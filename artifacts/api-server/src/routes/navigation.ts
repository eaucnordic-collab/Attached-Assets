import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, navItemsTable } from "@workspace/db";
import { serialize } from "../lib/serialize";
import {
  ListNavigationResponse,
  CreateNavItemBody,
  CreateNavItemResponse,
  UpdateNavItemParams,
  UpdateNavItemBody,
  UpdateNavItemResponse,
  DeleteNavItemParams,
  ReorderNavItemsBody,
  ReorderNavItemsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function buildTree(items: typeof navItemsTable.$inferSelect[]) {
  type ItemWithChildren = typeof navItemsTable.$inferSelect & { children: ItemWithChildren[] };
  const map = new Map<number, ItemWithChildren>();
  const roots: ItemWithChildren[] = [];

  items.forEach((item) => {
    map.set(item.id, { ...item, children: [] });
  });

  items.forEach((item) => {
    const node = map.get(item.id)!;
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

router.get("/navigation", async (_req, res): Promise<void> => {
  const items = await db.select().from(navItemsTable).orderBy(asc(navItemsTable.order));
  const tree = buildTree(items);
  res.json(serialize(tree));

});

router.post("/navigation", async (req, res): Promise<void> => {
  const parsed = CreateNavItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const all = await db.select().from(navItemsTable);
  const [item] = await db
    .insert(navItemsTable)
    .values({
      label: parsed.data.label,
      url: parsed.data.url ?? null,
      pageId: parsed.data.pageId ?? null,
      parentId: parsed.data.parentId ?? null,
      order: parsed.data.order ?? all.length,
      visible: parsed.data.visible ?? true,
      openInNewTab: parsed.data.openInNewTab ?? false,
    })
    .returning();
  res.status(201).json(serialize({ ...item, children: [] }));

});

router.patch("/navigation/:id", async (req, res): Promise<void> => {
  const params = UpdateNavItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateNavItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db
    .update(navItemsTable)
    .set(parsed.data)
    .where(eq(navItemsTable.id, params.data.id))
    .returning();
  if (!item) {
    res.status(404).json({ error: "Nav item not found" });
    return;
  }
  res.json(serialize({ ...item, children: [] }));

});

router.delete("/navigation/:id", async (req, res): Promise<void> => {
  const params = DeleteNavItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(navItemsTable).where(eq(navItemsTable.id, params.data.id));
  res.sendStatus(204);
});

router.post("/navigation/reorder", async (req, res): Promise<void> => {
  const parsed = ReorderNavItemsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { itemIds } = parsed.data;
  for (let i = 0; i < itemIds.length; i++) {
    await db.update(navItemsTable).set({ order: i }).where(eq(navItemsTable.id, itemIds[i]!));
  }
  const items = await db.select().from(navItemsTable).orderBy(asc(navItemsTable.order));
  const tree = buildTree(items);
  res.json(serialize(tree));

});

export default router;
