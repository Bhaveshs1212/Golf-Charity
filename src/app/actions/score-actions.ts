"use server";

import { revalidatePath } from "next/cache";

import { getServerSupabase } from "@/lib/supabase/server";
import { SCORE_LIMIT, SCORE_MAX, SCORE_MIN } from "@/lib/constants";

export async function addScoreAction(value: number) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return { error: "Supabase not configured" };
  }

  if (!Number.isFinite(value) || value < SCORE_MIN || value > SCORE_MAX) {
    return { error: "Score must be between 1 and 45" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data: scores } = await supabase
    .from("scores")
    .select("id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (scores && scores.length >= SCORE_LIMIT) {
    const oldest = scores[0];
    if (oldest) {
      await supabase.from("scores").delete().eq("id", oldest.id);
    }
  }

  const { error } = await supabase
    .from("scores")
    .insert({ user_id: user.id, value });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/scores");
  revalidatePath("/dashboard");

  return { ok: true };
}
