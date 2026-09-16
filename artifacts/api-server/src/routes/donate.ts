import { Router } from "express";
import { stripeProxy } from "../stripeClient";
import { sendMail } from "../lib/mailer";
import { logger } from "../lib/logger";

const router: Router = Router();
const notifiedSessions = new Set<string>();

function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char] ?? char);
}

function getOrigin(req: any): string {
  const origin = req.get("origin");
  if (origin && /^https?:\/\//.test(origin)) return origin.replace(/\/$/, "");
  return `${req.protocol}://${req.get("host")}`;
}

router.post("/checkout", async (req, res) => {
  const { amount, email, recurring } = req.body as { amount?: unknown; email?: unknown; recurring?: unknown };
  const amountInKr = typeof amount === "number" ? amount : Number(amount);
  const isRecurring = recurring === true;

  if (!Number.isFinite(amountInKr) || !Number.isInteger(amountInKr) || amountInKr < 1 || amountInKr > 1_000_000) {
    res.status(400).json({ error: "Choose a valid donation amount in DKK." });
    return;
  }
  if (email !== undefined && email !== "" && !isValidEmail(email)) {
    res.status(400).json({ error: "Enter a valid email address." });
    return;
  }

  try {
    const donorEmail = isValidEmail(email) ? email : undefined;
    const origin = getOrigin(req);
    const params = new URLSearchParams();
    params.set("mode", isRecurring ? "subscription" : "payment");
    params.set("payment_method_types[0]", "card");
    params.set("line_items[0][price_data][currency]", "dkk");
    params.set("line_items[0][price_data][product_data][name]", "Donation to EAUC Nordic");
    params.set("line_items[0][price_data][unit_amount]", String(amountInKr * 100));
    if (isRecurring) params.set("line_items[0][price_data][recurring][interval]", "month");
    params.set("line_items[0][quantity]", "1");
    if (donorEmail) params.set("customer_email", donorEmail);
    params.set("metadata[donation_amount_kr]", String(amountInKr));
    params.set("metadata[donor_email]", donorEmail ?? "");
    params.set("metadata[donation_frequency]", isRecurring ? "monthly" : "one_time");
    params.set("success_url", `${origin}/?donation=success&session_id={CHECKOUT_SESSION_ID}#don%C3%A9r`);
    params.set("cancel_url", `${origin}/?donation=cancelled#don%C3%A9r`);

    const response = await stripeProxy("/v1/checkout/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    const result = await response.json() as { url?: string; error?: { message?: string } };

    if (!response.ok || !result.url) {
      logger.error({ status: response.status, error: result.error?.message }, "Stripe Checkout rejected donation");
      res.status(502).json({ error: "Unable to start payment. Please try again." });
      return;
    }
    res.json({ url: result.url });
  } catch (error) {
    logger.error({ err: error }, "Failed to create Stripe donation checkout");
    res.status(502).json({ error: "Unable to start payment. Please try again." });
  }
});

router.get("/complete", async (req, res) => {
  const sessionId = typeof req.query.session_id === "string" ? req.query.session_id : "";
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    res.status(400).json({ error: "Invalid checkout session." });
    return;
  }

  try {
    const response = await stripeProxy(`/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, { method: "GET" });
    const session = await response.json() as {
      id?: string;
      payment_status?: string;
      amount_total?: number;
      customer_details?: { email?: string };
      metadata?: Record<string, string>;
    };
    if (!response.ok || session.payment_status !== "paid") {
      res.status(409).json({ paid: false });
      return;
    }

    if (!notifiedSessions.has(sessionId)) {
      notifiedSessions.add(sessionId);
      const amount = Number(session.amount_total ?? 0) / 100;
      const donorEmail = session.customer_details?.email || session.metadata?.donor_email || "";
      const notifyEmail = process.env.NOTIFY_EMAIL;
      if (notifyEmail && amount > 0) {
        await sendMail({
          to: notifyEmail,
          replyTo: isValidEmail(donorEmail) ? donorEmail : undefined,
          subject: `Новое пожертвование ${amount.toLocaleString("da-DK")} kr — EAUC Nordic`,
          html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#0d1b3e;padding:24px 32px"><h1 style="color:#fff;margin:0;font-size:20px">EAUC Nordic</h1><p style="color:#c8a84b;margin:4px 0 0">Платёж успешно получен</p></div>
            <div style="padding:24px 32px;background:#f9f9f9">
              <div style="background:#e8f8f0;border-left:4px solid #059669;padding:16px 20px;margin-bottom:20px"><p style="margin:0;color:#555">Сумма пожертвования</p><p style="margin:4px 0;font-size:28px;font-weight:700;color:#0d1b3e">${escapeHtml(amount.toLocaleString("da-DK"))} kr</p></div>
              ${donorEmail ? `<p style="margin:0 0 8px;color:#555">Email донора:</p><a href="mailto:${escapeHtml(donorEmail)}" style="color:#0d1b3e;font-weight:600">${escapeHtml(donorEmail)}</a>` : "<p style=\"color:#777\">Email не указан</p>"}
              <p style="margin-top:20px;color:#aaa;font-size:12px">Stripe session: ${escapeHtml(session.id)}</p>
            </div>
          </div>`,
        });
      }
    }
    res.json({ paid: true });
  } catch (error) {
    logger.error({ err: error }, "Failed to verify Stripe donation");
    res.status(502).json({ error: "Unable to verify payment." });
  }
});

export default router;