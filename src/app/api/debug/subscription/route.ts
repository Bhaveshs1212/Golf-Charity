import { NextResponse } from "next/server";

import { getServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: userError?.message || "No user" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, subscription_status, subscription_plan")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { userId: user.id, error: error?.message || "No profile" },
      { status: 500 },
    );
  }

  return NextResponse.json({ userId: user.id, ...data });
}
