"use server";

import { revalidatePath } from "next/cache";

import { getServerSupabase } from "@/lib/supabase/server";

export async function updateCharityAction({
  charityId,
  donationPercentage,
}: {
  charityId: string;
  donationPercentage: number;
}) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return { error: "Supabase not configured" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("users")
    .update({
      charity_id: charityId,
      donation_percentage: donationPercentage,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/charity");
  revalidatePath("/dashboard");

  return { ok: true };
}
