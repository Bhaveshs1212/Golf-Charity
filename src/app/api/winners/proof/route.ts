import { NextResponse } from "next/server";

import { getServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 400 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const winnerId = body?.winnerId as string | undefined;
  const proofUrl = body?.proofUrl as string | undefined;

  if (!winnerId || !proofUrl) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { error } = await supabase
    .from("winners")
    .update({ proof_url: proofUrl, status: "verified" })
    .eq("id", winnerId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
