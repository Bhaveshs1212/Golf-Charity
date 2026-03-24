"use server";

import { revalidatePath } from "next/cache";

import { getServerSupabase } from "@/lib/supabase/server";

export async function updateWinnerProof({
  winnerId,
  proofUrl,
}: {
  winnerId: string;
  proofUrl: string;
}) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return { error: "Supabase not configured" };
  }

  const { error } = await supabase
    .from("winners")
    .update({ proof_url: proofUrl, status: "verified" })
    .eq("id", winnerId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/winnings");
  return { ok: true };
}
