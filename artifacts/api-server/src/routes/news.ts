import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, newsTable } from "@workspace/db";
import { serialize } from "../lib/serialize";
import {
  ListNewsResponse,
  CreateNewsPostBody,
  CreateNewsPostResponse,
  GetNewsPostParams,
  GetNewsPostResponse,
  UpdateNewsPostParams,
  UpdateNewsPostBody,
  UpdateNewsPostResponse,
  DeleteNewsPostParams,
  PublishNewsPostParams,
  PublishNewsPostBody,
  PublishNewsPostResponse,
} from "@workspace/api-zod";
import { generateNewsExcerpt, sanitizeNewsHtml } from "../lib/news-content";
import { readAdminSession } from "../lib/admin-auth";

const router: IRouter = Router();

router.get("/news", async (req, res): Promise<void> => {
  const requestedStatus = req.query.status as string | undefined;
  const status = readAdminSession(req) ? requestedStatus : "published";
  const category = req.query.category as string | undefined;
  const language = req.query.language as string | undefined;
  const translationGroup = req.query.translationGroup as string | undefined;
  const page = parseInt((req.query.page as string) || "1", 10);
  const limit = parseInt((req.query.limit as string) || "10", 10);

  let all = await db.select().from(newsTable).orderBy(desc(newsTable.createdAt));
  if (status && status !== "all") {
    all = all.filter((n) => n.status === status);
  }
  if (category) {
    all = all.filter((n) => n.category === category);
  }
  if (language) {
    all = all.filter((n) => n.language === language);
  }
  if (translationGroup) {
    all = all.filter((n) => n.translationGroup === translationGroup);
  }
  const total = all.length;
  const items = all.slice((page - 1) * limit, page * limit);
  res.json(serialize({ items, total, page, limit }));

});

router.post("/news", async (req, res): Promise<void> => {
  const parsed = CreateNewsPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [post] = await db
    .insert(newsTable)
    .values({
      title: parsed.data.title,
      slug: parsed.data.slug,
      content: sanitizeNewsHtml(parsed.data.content) ?? null,
      excerpt: parsed.data.excerpt?.trim() || generateNewsExcerpt(parsed.data.content),
      coverImage: parsed.data.coverImage ?? null,
      galleryImages: parsed.data.galleryImages ?? [],
      author: parsed.data.author ?? null,
      category: parsed.data.category ?? null,
      language: parsed.data.language ?? "da",
      translationGroup: parsed.data.translationGroup || parsed.data.slug,
      tags: (parsed.data.tags as string[]) ?? [],
      pinned: parsed.data.pinned ?? false,
    })
    .returning();
  res.status(201).json(serialize(post));

});

router.get("/news/:id", async (req, res): Promise<void> => {
  const params = GetNewsPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [post] = await db.select().from(newsTable).where(eq(newsTable.id, params.data.id));
  if (!post) {
    res.status(404).json({ error: "News post not found" });
    return;
  }
  if (post.status !== "published" && !readAdminSession(req)) {
    res.status(404).json({ error: "News post not found" });
    return;
  }
  res.json(serialize(post));

});

router.patch("/news/:id", async (req, res): Promise<void> => {
  const params = UpdateNewsPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateNewsPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [post] = await db
    .update(newsTable)
    .set({
      ...parsed.data,
      content: parsed.data.content === undefined ? undefined : sanitizeNewsHtml(parsed.data.content),
      excerpt: parsed.data.excerpt === undefined
        ? undefined
        : (parsed.data.excerpt?.trim() || generateNewsExcerpt(parsed.data.content)),
      ...(parsed.data.translationGroup === ""
        ? { translationGroup: parsed.data.slug || undefined }
        : {}),
    })
    .where(eq(newsTable.id, params.data.id))
    .returning();
  if (!post) {
    res.status(404).json({ error: "News post not found" });
    return;
  }
  res.json(serialize(post));

});

router.delete("/news/:id", async (req, res): Promise<void> => {
  const params = DeleteNewsPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(newsTable).where(eq(newsTable.id, params.data.id));
  res.sendStatus(204);
});

router.post("/news/:id/publish", async (req, res): Promise<void> => {
  const params = PublishNewsPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = PublishNewsPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [post] = await db
    .update(newsTable)
    .set({
      status: parsed.data.publish ? "published" : "draft",
      publishedAt: parsed.data.publish ? new Date() : null,
    })
    .where(eq(newsTable.id, params.data.id))
    .returning();
  if (!post) {
    res.status(404).json({ error: "News post not found" });
    return;
  }
  res.json(serialize(post));

});

export default router;
