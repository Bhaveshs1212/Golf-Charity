import { getServerSupabase } from "@/lib/supabase/server";

export async function getSubscriptionStatus(userId: string) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return "inactive" as const;
  }

  const { data, error } = await supabase
    .from("users")
    .select("subscription_status")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return "inactive" as const;
  }

  return data.subscription_status as "active" | "inactive" | "past_due" | "canceled";
}
