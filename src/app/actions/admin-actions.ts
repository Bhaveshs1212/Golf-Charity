"use server";

import { revalidatePath } from "next/cache";

import { getServerSupabase } from "@/lib/supabase/server";
import { generateRandomDraw, countMatches } from "@/lib/draw";
import {
  POOL_PERCENTAGE,
  PRIZE_SPLITS,
  SUBSCRIPTION_MONTHLY,
  SUBSCRIPTION_YEARLY,
} from "@/lib/constants";
import { formatMonthYear } from "@/lib/date";

async function requireAdminAccess() {
  const supabase = getServerSupabase();
  if (!supabase) {
    return { supabase: null, error: "Supabase not configured" } as const;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase: null, error: "Not authenticated" } as const;
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return { supabase: null, error: "Admin access required" } as const;
  }

  return { supabase, error: null } as const;
}

export async function addCharityAction(formData: FormData) {
  const { supabase, error } = await requireAdminAccess();
  if (!supabase || error) {
    return { error: error || "Admin access required" };
  }

  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!name) {
    return { error: "Name is required" };
  }

  const { error: insertError } = await supabase
    .from("charities")
    .insert({ name, description });

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath("/admin/charities");
  return { ok: true };
}

export async function updateWinnerStatusAction(formData: FormData) {
  const { supabase, error } = await requireAdminAccess();
  if (!supabase || error) {
    return { error: error || "Admin access required" };
  }

  const winnerId = String(formData.get("winnerId") || "");
  const status = String(formData.get("status") || "");

  if (!winnerId || !status) {
    return { error: "Invalid payload" };
  }

  const { error: updateError } = await supabase
    .from("winners")
    .update({ status })
    .eq("id", winnerId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/admin/winners");
  return { ok: true };
}

export async function publishDrawAction() {
  const { supabase, error } = await requireAdminAccess();
  if (!supabase || error) {
    return { error: error || "Admin access required" };
  }

  const month = formatMonthYear(new Date());
  const { data: existing } = await supabase
    .from("draws")
    .select("id, status, numbers")
    .eq("month", month)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing?.status === "published") {
    return { error: "Draw already published." };
  }

  const drawNumbers = existing?.numbers?.length
    ? existing.numbers
    : generateRandomDraw();

  let drawId = existing?.id;
  if (!drawId) {
    const { data: inserted, error: insertError } = await supabase
      .from("draws")
      .insert({ month, numbers: drawNumbers, draw_type: "random" })
      .select("id")
      .single();

    if (insertError || !inserted) {
      return { error: insertError?.message || "Draw creation failed" };
    }

    drawId = inserted.id;
  }

  const { data: users } = await supabase
    .from("users")
    .select("id, subscription_plan")
    .eq("subscription_status", "active");

  const activeUsers = users || [];
  let totalFees = 0;

  await supabase.from("participations").delete().eq("draw_id", drawId);
  await supabase.from("winners").delete().eq("draw_id", drawId);

  const participations: {
    draw_id: string;
    user_id: string;
    scores_snapshot: number[];
    matches: number;
  }[] = [];

  const winnerRows: {
    draw_id: string;
    user_id: string;
    matches: number;
    prize_amount: number;
    status: "pending";
  }[] = [];

  for (const user of activeUsers) {
    const { data: scores } = await supabase
      .from("scores")
      .select("value")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    const scoreValues = scores?.map((score) => score.value) || [];

    if (scoreValues.length < 5) {
      continue;
    }

    const matches = countMatches(scoreValues, drawNumbers);
    participations.push({
      draw_id: drawId,
      user_id: user.id,
      scores_snapshot: scoreValues,
      matches,
    });

    if (matches >= 3) {
      winnerRows.push({
        draw_id: drawId,
        user_id: user.id,
        matches,
        prize_amount: 0,
        status: "pending",
      });
    }

    const planFee =
      user.subscription_plan === "yearly"
        ? SUBSCRIPTION_YEARLY / 12
        : SUBSCRIPTION_MONTHLY;
    totalFees += planFee;
  }

  if (participations.length) {
    await supabase.from("participations").insert(participations);
  }

  if (winnerRows.length) {
    await supabase.from("winners").insert(winnerRows);
  }

  const totalPool = totalFees * POOL_PERCENTAGE;
  const tierPools = {
    five: totalPool * PRIZE_SPLITS.five,
    four: totalPool * PRIZE_SPLITS.four,
    three: totalPool * PRIZE_SPLITS.three,
  };

  const counts = {
    five: winnerRows.filter((row) => row.matches === 5).length,
    four: winnerRows.filter((row) => row.matches === 4).length,
    three: winnerRows.filter((row) => row.matches === 3).length,
  };

  const prizePerWinner = {
    five: counts.five > 0 ? tierPools.five / counts.five : 0,
    four: counts.four > 0 ? tierPools.four / counts.four : 0,
    three: counts.three > 0 ? tierPools.three / counts.three : 0,
  };

  const { data: lastDraw } = await supabase
    .from("draws")
    .select("rollover_amount")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const rolloverAmount =
    counts.five === 0 ? (lastDraw?.rollover_amount || 0) + tierPools.five : 0;

  await supabase
    .from("draws")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      numbers: drawNumbers,
      prize_total: totalPool,
      prize_tiers: tierPools,
      rollover_amount: rolloverAmount,
    })
    .eq("id", drawId);

  if (winnerRows.length) {
    await supabase
      .from("winners")
      .update({ prize_amount: prizePerWinner.five })
      .eq("draw_id", drawId)
      .eq("matches", 5);

    await supabase
      .from("winners")
      .update({ prize_amount: prizePerWinner.four })
      .eq("draw_id", drawId)
      .eq("matches", 4);

    await supabase
      .from("winners")
      .update({ prize_amount: prizePerWinner.three })
      .eq("draw_id", drawId)
      .eq("matches", 3);
  }

  revalidatePath("/admin/draws");
  revalidatePath("/draw");
  revalidatePath("/dashboard");

  return { ok: true };
}
