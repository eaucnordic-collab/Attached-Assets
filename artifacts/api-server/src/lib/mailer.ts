import nodemailer from 'nodemailer';

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendMail(options: MailOptions): Promise<boolean> {
  const transport = createTransport();
  if (!transport) {
    console.warn('[mailer] SMTP not configured — skipping email');
    return false;
  }
  await transport.sendMail({
    from: `"EAUC Nordic" <${process.env.SMTP_USER}>`,
    replyTo: options.replyTo,
    ...options,
  });
  return true;
}
