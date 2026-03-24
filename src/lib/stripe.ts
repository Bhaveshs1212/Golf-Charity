import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET;
  if (!key) {
    return null;
  }

  return new Stripe(key, {
    apiVersion: "2024-12-18.acacia",
    typescript: true,
  });
}
