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
    const senderEmail = fields['email'] || fields['Email'] || fields['e-mail'] || '';
    const senderName = fields['name'] || fields['Name'] || fields['navn'] || '';

    // Build table rows — highlight email row
    const rows = Object.entries(fields)
      .map(([k, v]) => {
        const isEmail = /^e?-?mail$/i.test(k);
        return `<tr style="${isEmail ? 'background:#fffbe6' : ''}">
          <td style="padding:8px 12px;font-weight:600;color:#555;white-space:nowrap;border-bottom:1px solid #f0f0f0">${k}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0">${isEmail ? `<a href="mailto:${v}" style="color:#0d1b3e">${v}</a>` : v}</td>
        </tr>`;
      })
      .join('');

    sendMail({
      to: notifyEmail,
      replyTo: senderEmail ? `${senderName} <${senderEmail}>` : undefined,
      subject: `Новая заявка с сайта EAUC Nordic${senderName ? ` от ${senderName}` : ''}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#0d1b3e;padding:24px 32px">
            <h1 style="color:#fff;margin:0;font-size:20px">EAUC Nordic</h1>
            <p style="color:#c8a84b;margin:4px 0 0;font-size:14px">Новая заявка с сайта</p>
          </div>
          <div style="padding:24px 32px;background:#f9f9f9">
            ${senderEmail ? `<div style="background:#e8f4fd;border-left:4px solid #0d1b3e;padding:12px 16px;margin-bottom:20px;border-radius:0 8px 8px 0">
              <p style="margin:0;font-size:13px;color:#555">Ответить отправителю:</p>
              <a href="mailto:${senderEmail}" style="font-size:16px;font-weight:600;color:#0d1b3e;text-decoration:none">${senderEmail}</a>
            </div>` : ''}
            <table style="border-collapse:collapse;width:100%;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08)">
              ${rows}
            </table>
            <p style="margin:16px 0 0;color:#aaa;font-size:12px">
              Получено ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Copenhagen' })} · IP: ${ip ?? '—'}
            </p>
          </div>
        </div>`,
    }).catch((err) => console.error('[mailer] send error:', err));
  }

  res.status(201).json(serialize(submission));

});

export default router;
