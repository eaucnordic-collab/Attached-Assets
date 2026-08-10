import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, formsTable, submissionsTable } from "@workspace/db";
import { serialize } from "../lib/serialize";
import { sendMail } from "../lib/mailer";
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

  // Send email notification if SMTP is configured
  const notifyEmail = process.env.NOTIFY_EMAIL;
  if (notifyEmail) {
    const fields = parsed.data.data as Record<string, string>;
    const rows = Object.entries(fields)
      .map(([k, v]) => `<tr><td style="padding:6px 12px;font-weight:600;color:#555;white-space:nowrap">${k}</td><td style="padding:6px 12px">${v}</td></tr>`)
      .join('');
    sendMail({
      to: notifyEmail,
      subject: `Новая заявка с сайта EAUC Nordic — ${form.name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#0d1b3e;padding:24px 32px">
            <h1 style="color:#fff;margin:0;font-size:20px">EAUC Nordic</h1>
          </div>
          <div style="padding:24px 32px;background:#f9f9f9">
            <h2 style="margin:0 0 16px;color:#0d1b3e">Новая заявка: ${form.name}</h2>
            <table style="border-collapse:collapse;width:100%;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08)">
              ${rows}
            </table>
            <p style="margin:16px 0 0;color:#888;font-size:12px">
              Получено ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Copenhagen' })} · IP: ${ip ?? '—'}
            </p>
          </div>
        </div>`,
    }).catch((err) => console.error('[mailer] send error:', err));
  }

  res.status(201).json(serialize(submission));

});

export default router;
