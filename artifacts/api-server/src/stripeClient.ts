import { ReplitConnectors } from "@replit/connectors-sdk";

type StripeProxyOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

/** Uses the connected Stripe account without exposing API keys to the app. */
export async function stripeProxy(path: string, options?: StripeProxyOptions): Promise<Response> {
  const connectors = new ReplitConnectors();
  return connectors.proxy("stripe", path, options);
}