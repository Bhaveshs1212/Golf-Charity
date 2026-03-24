"use client";

import { useActionState } from "react";

import Button from "@/components/ui/Button";
import { updateWinnerStatusAction } from "@/app/actions/admin-actions";

type AdminActionState = { error?: string; success?: string };

const initialState: AdminActionState = {};

async function updateWinnerStatusFormAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const result = await updateWinnerStatusAction(formData);
  if (result?.error) {
    return { error: result.error };
  }
  return { success: "Winner updated." };
}

export default function WinnerStatusForm({ winnerId }: { winnerId: string }) {
  const [state, formAction, isPending] = useActionState(
    updateWinnerStatusFormAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="winnerId" value={winnerId} />
      <input type="hidden" name="status" value="paid" />
      <Button type="submit" variant="secondary" disabled={isPending}>
        Mark paid
      </Button>
      {state.error && <span className="text-sm text-accent">{state.error}</span>}
      {state.success && (
        <span className="text-sm text-success">{state.success}</span>
      )}
    </form>
  );
}
