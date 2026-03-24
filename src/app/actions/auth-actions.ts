"use server";

import { redirect } from "next/navigation";

import { getServerSupabase } from "@/lib/supabase/server";
import { env } from "@/lib/env";

export type AuthState = { error?: string; success?: string };

export async function signInAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = getServerSupabase();
  if (!supabase) {
    return { error: "Supabase not configured" };
  }

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signUpAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = getServerSupabase();
  if (!supabase) {
    return { error: "Supabase not configured" };
  }

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: env.publicUrl ? `${env.publicUrl}/login` : undefined,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    await supabase.from("users").upsert({
      id: data.user.id,
      email: data.user.email,
    });
  }

  if (data.session) {
    redirect("/dashboard");
  }

  return { success: "Check your email to confirm, then sign in." };
}

export async function signOutAction() {
  const supabase = getServerSupabase();
  if (!supabase) {
    return { error: "Supabase not configured" };
  }

  await supabase.auth.signOut();
  redirect("/login");
}
