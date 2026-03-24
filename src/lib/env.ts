const priceIdsRaw = process.env.PRICE_IDS || "";
let priceIds: { monthly?: string; yearly?: string } = {};

if (priceIdsRaw) {
  try {
    priceIds = JSON.parse(priceIdsRaw) as { monthly?: string; yearly?: string };
  } catch {
    priceIds = {};
  }
}

export const env = {
  supabaseUrl:
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseAnonKey:
    process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY || "",
  stripeSecret: process.env.STRIPE_SECRET || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  monthlyPriceId:
    process.env.STRIPE_PRICE_MONTHLY || priceIds.monthly || "",
  yearlyPriceId: process.env.STRIPE_PRICE_YEARLY || priceIds.yearly || "",
  publicUrl: process.env.NEXT_PUBLIC_URL || "",
};
