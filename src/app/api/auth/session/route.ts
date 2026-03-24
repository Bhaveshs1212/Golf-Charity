import { NextResponse } from "next/server";

import { getServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ user: null, error: "Supabase not configured" });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return NextResponse.json({ user });
}
