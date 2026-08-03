import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, teamTable } from "@workspace/db";
import { serialize } from "../lib/serialize";
import {
  ListTeamMembersResponse,
  CreateTeamMemberBody,
  CreateTeamMemberResponse,
  UpdateTeamMemberParams,
  UpdateTeamMemberBody,
  UpdateTeamMemberResponse,
  DeleteTeamMemberParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/team", async (_req, res): Promise<void> => {
  const members = await db.select().from(teamTable).orderBy(asc(teamTable.order));
  res.json(serialize(members));

});

router.post("/team", async (req, res): Promise<void> => {
  const parsed = CreateTeamMemberBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const all = await db.select().from(teamTable);
  const [member] = await db
    .insert(teamTable)
    .values({
      name: parsed.data.name,
      position: parsed.data.position ?? null,
      bio: parsed.data.bio ?? null,
      photo: parsed.data.photo ?? null,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone ?? null,
      linkedin: parsed.data.linkedin ?? null,
      facebook: parsed.data.facebook ?? null,
      instagram: parsed.data.instagram ?? null,
      order: parsed.data.order ?? all.length,
      visible: parsed.data.visible ?? true,
    })
    .returning();
  res.status(201).json(serialize(member));

});

router.patch("/team/:id", async (req, res): Promise<void> => {
  const params = UpdateTeamMemberParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateTeamMemberBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [member] = await db
    .update(teamTable)
    .set(parsed.data)
    .where(eq(teamTable.id, params.data.id))
    .returning();
  if (!member) {
    res.status(404).json({ error: "Team member not found" });
    return;
  }
  res.json(serialize(member));

});

router.delete("/team/:id", async (req, res): Promise<void> => {
  const params = DeleteTeamMemberParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(teamTable).where(eq(teamTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
