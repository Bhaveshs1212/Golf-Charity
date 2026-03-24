"use client";

import { useActionState } from "react";

import Button from "@/components/ui/Button";
import { publishDrawAction } from "@/app/actions/admin-actions";

type AdminActionState = { error?: string; success?: string };

const initialState: AdminActionState = {};

async function publishDrawFormAction(
  _prev: AdminActionState,
  _formData: FormData,
): Promise<AdminActionState> {
  const result = await publishDrawAction();
  if (result?.error) {
    return { error: result.error };
  }
  return { success: "Draw published." };
}

export default function PublishDrawForm() {
  const [state, formAction, isPending] = useActionState(
    publishDrawFormAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex items-center gap-3">
      <Button type="submit" disabled={isPending}>
        Publish draw
      </Button>
      {state.error && <span className="text-sm text-accent">{state.error}</span>}
      {state.success && (
        <span className="text-sm text-success">{state.success}</span>
      )}
    </form>
  );
}
