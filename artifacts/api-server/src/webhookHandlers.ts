import { getStripeSync } from "./stripeClient";
import { sendMail } from "./lib/mailer";
import { logger } from "./lib/logger";

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char] ?? char);
}

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error("Stripe webhook payload must be a Buffer. Register the raw-body route before express.json().");
    }

    const sync = await getStripeSync();
    await sync.processWebhook(payload, signature);

    // StripeSync verifies the signature before this event is inspected.
    const event = JSON.parse(payload.toString("utf8")) as {
      id?: string;
      type?: string;
      data?: { object?: Record<string, unknown> };
    };
    if (event.type !== "checkout.session.completed") return;

    const session = event.data?.object ?? {};
    if (session.payment_status !== "paid") return;

    const amount = Number(session.amount_total ?? 0) / 100;
    const customerDetails = session.customer_details as { email?: string } | undefined;
    const metadata = session.metadata as Record<string, string> | undefined;
    const donorEmail = customerDetails?.email || metadata?.donor_email || "";
    const notifyEmail = process.env.NOTIFY_EMAIL;
    if (!notifyEmail || !amount) return;

    try {
      await sendMail({
        to: notifyEmail,
        replyTo: donorEmail.includes("@") ? donorEmail : undefined,
        subject: `Новое пожертвование ${amount.toLocaleString("da-DK")} kr — EAUC Nordic`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#0d1b3e;padding:24px 32px"><h1 style="color:#fff;margin:0;font-size:20px">EAUC Nordic</h1><p style="color:#c8a84b;margin:4px 0 0">Платёж успешно получен</p></div>
          <div style="padding:24px 32px;background:#f9f9f9">
            <div style="background:#e8f8f0;border-left:4px solid #059669;padding:16px 20px;margin-bottom:20px"><p style="margin:0;color:#555">Сумма пожертвования</p><p style="margin:4px 0;font-size:28px;font-weight:700;color:#0d1b3e">${escapeHtml(amount.toLocaleString("da-DK"))} kr</p></div>
            ${donorEmail ? `<p style="margin:0 0 8px;color:#555">Email донора:</p><a href="mailto:${escapeHtml(donorEmail)}" style="color:#0d1b3e;font-weight:600">${escapeHtml(donorEmail)}</a>` : "<p style=\"color:#777\">Email не указан</p>"}
            <p style="margin-top:20px;color:#aaa;font-size:12px">Stripe event: ${escapeHtml(event.id)}</p>
          </div>
        </div>`,
      });
    } catch (error) {
      logger.error({ err: error, eventId: event.id }, "Failed to send donation payment email");
    }
  }
}
