import { NextResponse } from "next/server";
import Stripe from "stripe";

import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { getServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 400 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature || !env.stripeWebhookSecret) {
    return NextResponse.json({ error: "Missing webhook signature" }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.stripeWebhookSecret,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;

    if (customerEmail) {
      await supabase
        .from("users")
        .update({ subscription_status: "active" })
        .eq("email", customerEmail);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    await supabase
      .from("users")
      .update({ subscription_status: "canceled" })
      .eq("stripe_customer_id", customerId);
  }

  return NextResponse.json({ received: true });
}
