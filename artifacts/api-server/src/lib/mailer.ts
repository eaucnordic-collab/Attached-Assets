import { Resend } from 'resend';

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendMail(options: MailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[mailer] RESEND_API_KEY not set — skipping email');
    return false;
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM ?? 'EAUC Nordic <onboarding@resend.dev>';

  await resend.emails.send({
    from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
  });

  return true;
}
