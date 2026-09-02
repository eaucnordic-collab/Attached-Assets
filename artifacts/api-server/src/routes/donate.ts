import { Router } from "express";
import { getUncachableStripeClient } from "../stripeClient";
import { logger } from "../lib/logger";

const router: Router = Router();

function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getOrigin(req: any): string {
  const origin = req.get("origin");
  if (origin && /^https?:\/\//.test(origin)) return origin.replace(/\/$/, "");
  return `${req.protocol}://${req.get("host")}`;
}

router.post("/checkout", async (req, res) => {
  const { amount, email } = req.body as { amount?: unknown; email?: unknown };
  const amountInKr = typeof amount === "number" ? amount : Number(amount);

  if (!Number.isFinite(amountInKr) || !Number.isInteger(amountInKr) || amountInKr < 1 || amountInKr > 1_000_000) {
    res.status(400).json({ error: "Choose a valid donation amount in DKK." });
    return;
  }
  if (email !== undefined && email !== "" && !isValidEmail(email)) {
    res.status(400).json({ error: "Enter a valid email address." });
    return;
  }

  try {
    const stripe = await getUncachableStripeClient();
    const donorEmail = isValidEmail(email) ? email : undefined;
    const origin = getOrigin(req);

    // Donations have a variable amount, so this creates a one-time Checkout price.
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "dkk",
          product_data: { name: "Donation to EAUC Nordic" },
          unit_amount: amountInKr * 100,
        },
        quantity: 1,
      }],
      ...(donorEmail ? { customer_email: donorEmail } : {}),
      metadata: {
        donation_amount_kr: String(amountInKr),
        donor_email: donorEmail ?? "",
      },
      success_url: `${origin}/?donation=success&session_id={CHECKOUT_SESSION_ID}#donér`,
      cancel_url: `${origin}/?donation=cancelled#donér`,
    });

    if (!session.url) throw new Error("Stripe did not return a checkout URL.");
    res.json({ url: session.url });
  } catch (error) {
    logger.error({ err: error }, "Failed to create Stripe donation checkout");
    res.status(502).json({ error: "Unable to start payment. Please try again." });
  }
});

export default router;
