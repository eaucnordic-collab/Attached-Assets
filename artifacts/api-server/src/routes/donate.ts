import { Router } from "express";
import { sendMail } from "../lib/mailer";

const router: Router = Router();

router.post("/notify", async (req, res) => {
  const { amount, email } = req.body as { amount?: unknown; email?: unknown };

  if (typeof amount !== "number" || amount <= 0) {
    res.status(400).json({ error: "Invalid amount" });
    return;
  }
  const notifyEmail = process.env.NOTIFY_EMAIL;

  if (notifyEmail) {
    const replyTo = email || undefined;
    sendMail({
      to: notifyEmail,
      replyTo,
      subject: `💙 Нове пожертвування ${amount.toLocaleString("da-DK")} kr — EAUC Nordic`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#0d1b3e;padding:24px 32px">
            <h1 style="color:#fff;margin:0;font-size:20px">EAUC Nordic</h1>
            <p style="color:#c8a84b;margin:4px 0 0;font-size:14px">Нове пожертвування</p>
          </div>
          <div style="padding:24px 32px;background:#f9f9f9">
            <div style="background:#e8f8f0;border-left:4px solid #059669;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:20px">
              <p style="margin:0;font-size:13px;color:#555">Сума пожертвування</p>
              <p style="margin:4px 0 0;font-size:28px;font-weight:700;color:#0d1b3e">${amount.toLocaleString("da-DK")} kr</p>
            </div>
            ${email ? `
            <div style="background:#e8f4fd;border-left:4px solid #0d1b3e;padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:20px">
              <p style="margin:0;font-size:13px;color:#555">Email донора (для квитанції):</p>
              <a href="mailto:${email}" style="font-size:16px;font-weight:600;color:#0d1b3e;text-decoration:none">${email}</a>
            </div>` : ""}
            <p style="margin:0;color:#aaa;font-size:12px">
              ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Copenhagen" })} · EAUC Nordic
            </p>
          </div>
        </div>`,
    }).catch((err) => console.error("[mailer] donate notify error:", err));
  }

  res.status(200).json({ ok: true });
});

export default router;
