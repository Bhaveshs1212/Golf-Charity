import { NextResponse } from "next/server";

import { calculatePrizePool } from "@/lib/prize";
import { getServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 400 });
  }

  const body = await request.json();
  const { drawId, activeUsers, subscriptionFee, winners } = body ?? {};

  if (!drawId || !activeUsers || !subscriptionFee || !winners) {
    return NextResponse.json({ error: "Missing payload" }, { status: 400 });
  }

  const prize = calculatePrizePool({
    activeUsers,
    subscriptionFee,
    winners,
  });

  const { error } = await supabase
    .from("draws")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      prize_total: prize.totalPool,
      prize_tiers: prize.tierPools,
    })
    .eq("id", drawId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ status: "ok", prize });
}
