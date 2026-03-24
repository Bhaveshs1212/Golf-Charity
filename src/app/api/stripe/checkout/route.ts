import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { getServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 400 });
  }

  const supabase = getServerSupabase();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const plan = body?.plan === "yearly" ? "yearly" : "monthly";
  const priceId =
    plan === "yearly" ? env.yearlyPriceId : env.monthlyPriceId;

  if (!priceId || !env.publicUrl) {
    return NextResponse.json({ error: "Missing Stripe price IDs" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${env.publicUrl}/subscription?status=success`,
    cancel_url: `${env.publicUrl}/subscription?status=cancel`,
    client_reference_id: user.id,
    customer_email: user.email || undefined,
    metadata: { user_id: user.id, plan },
  });

  return NextResponse.json({ url: session.url });
}
