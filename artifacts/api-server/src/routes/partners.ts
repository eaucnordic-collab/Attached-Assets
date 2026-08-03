import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, partnersTable } from "@workspace/db";
import { serialize } from "../lib/serialize";
import {
  ListPartnersResponse,
  CreatePartnerBody,
  CreatePartnerResponse,
  UpdatePartnerParams,
  UpdatePartnerBody,
  UpdatePartnerResponse,
  DeletePartnerParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/partners", async (_req, res): Promise<void> => {
  const partners = await db.select().from(partnersTable).orderBy(asc(partnersTable.order));
  res.json(serialize(partners));

});

router.post("/partners", async (req, res): Promise<void> => {
  const parsed = CreatePartnerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const all = await db.select().from(partnersTable);
  const [partner] = await db
    .insert(partnersTable)
    .values({
      name: parsed.data.name,
      logo: parsed.data.logo ?? null,
      description: parsed.data.description ?? null,
      url: parsed.data.url ?? null,
      category: parsed.data.category ?? null,
      order: parsed.data.order ?? all.length,
      visible: parsed.data.visible ?? true,
    })
    .returning();
  res.status(201).json(serialize(partner));

});

router.patch("/partners/:id", async (req, res): Promise<void> => {
  const params = UpdatePartnerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdatePartnerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [partner] = await db
    .update(partnersTable)
    .set(parsed.data)
    .where(eq(partnersTable.id, params.data.id))
    .returning();
  if (!partner) {
    res.status(404).json({ error: "Partner not found" });
    return;
  }
  res.json(serialize(partner));

});

router.delete("/partners/:id", async (req, res): Promise<void> => {
  const params = DeletePartnerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(partnersTable).where(eq(partnersTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
