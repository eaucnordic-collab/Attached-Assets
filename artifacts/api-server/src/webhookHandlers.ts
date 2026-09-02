// Kept as a compatibility placeholder for older deployments.
// Donation completion is verified through the Stripe Checkout session endpoint.
export class WebhookHandlers {
  static async processWebhook(): Promise<void> {
    throw new Error("Stripe webhook handling is not enabled in this connector-based setup.");
  }
}
