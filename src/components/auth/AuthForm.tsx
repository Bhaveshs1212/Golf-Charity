"use client";

import { useActionState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { AuthState } from "@/app/actions/auth-actions";

const initialState: AuthState = {};

export default function AuthForm({
  action,
  mode,
}: {
  action: (prev: AuthState, formData: FormData) => Promise<AuthState>;
  mode: "login" | "signup";
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label className="text-sm text-text-secondary">Email</label>
        <Input name="email" type="email" placeholder="user@test.com" required />
      </div>
      <div>
        <label className="text-sm text-text-secondary">Password</label>
        <Input name="password" type="password" placeholder="Test1234!" required />
      </div>
      {state.error && <p className="text-sm text-accent">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-success">{state.success}</p>
      )}
      <Button className="w-full" disabled={isPending}>
        {mode === "login" ? "Sign in" : "Create account"}
      </Button>
    </form>
  );
}
