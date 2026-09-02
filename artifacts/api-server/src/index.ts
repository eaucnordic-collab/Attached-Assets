import app from "./app";
import { logger } from "./lib/logger";
import { seedContactForm } from "./lib/seed";
import { runMigrations } from "stripe-replit-sync";
import { getStripeSync } from "./stripeClient";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function initStripe() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required for Stripe.");

  await runMigrations({ databaseUrl });
  const stripeSync = await getStripeSync();
  const domain = process.env.REPLIT_DOMAINS?.split(",")[0];
  if (!domain) throw new Error("REPLIT_DOMAINS is required for Stripe webhooks.");

  await stripeSync.findOrCreateManagedWebhook(
    `https://${domain}/api/stripe/webhook`,
  );
  stripeSync.syncBackfill().catch((err) => {
    logger.error({ err }, "Stripe backfill failed");
  });
}

await initStripe();

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
  seedContactForm();
});
