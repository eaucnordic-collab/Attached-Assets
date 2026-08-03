import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, formsTable, submissionsTable } from "@workspace/db";
import { serialize } from "../lib/serialize";
import {
  ListFormsResponse,
  CreateFormBody,
  CreateFormResponse,
  GetFormParams,
  GetFormResponse,
  UpdateFormParams,
  UpdateFormBody,
  UpdateFormResponse,
  DeleteFormParams,
  SubmitFormParams,
  SubmitFormBody,
  SubmitFormResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/forms", async (_req, res): Promise<void> => {
  const forms = await db.select().from(formsTable).orderBy(desc(formsTable.createdAt));
  res.json(serialize(forms));

});

router.post("/forms", async (req, res): Promise<void> => {
  const parsed = CreateFormBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [form] = await db
    .insert(formsTable)
    .values({
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      fields: (parsed.data.fields as unknown[]) ?? [],
      submitButtonLabel: parsed.data.submitButtonLabel ?? "Submit",
      successMessage: parsed.data.successMessage ?? null,
    })
    .returning();
  res.status(201).json(serialize(form));

});

router.get("/forms/:id", async (req, res): Promise<void> => {
  const params = GetFormParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [form] = await db.select().from(formsTable).where(eq(formsTable.id, params.data.id));
  if (!form) {
    res.status(404).json({ error: "Form not found" });
    return;
  }
  res.json(serialize(form));

});

router.patch("/forms/:id", async (req, res): Promise<void> => {
  const params = UpdateFormParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateFormBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [form] = await db
    .update(formsTable)
    .set(parsed.data)
    .where(eq(formsTable.id, params.data.id))
    .returning();
  if (!form) {
    res.status(404).json({ error: "Form not found" });
    return;
  }
  res.json(serialize(form));

});

router.delete("/forms/:id", async (req, res): Promise<void> => {
  const params = DeleteFormParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(formsTable).where(eq(formsTable.id, params.data.id));
  res.sendStatus(204);
});

router.post("/forms/:id/submit", async (req, res): Promise<void> => {
  const params = SubmitFormParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = SubmitFormBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [form] = await db.select().from(formsTable).where(eq(formsTable.id, params.data.id));
  if (!form) {
    res.status(404).json({ error: "Form not found" });
    return;
  }
  const ip = req.ip ?? null;
  const [submission] = await db
    .insert(submissionsTable)
    .values({
      formId: params.data.id,
      formName: form.name,
      data: parsed.data.data as Record<string, unknown>,
      ipAddress: ip,
    })
    .returning();
  res.status(201).json(serialize(submission));

});

export default router;
