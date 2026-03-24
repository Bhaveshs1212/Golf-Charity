"use client";

import { useActionState, useEffect, useRef } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { addCharityAction } from "@/app/actions/admin-actions";

type AdminActionState = { error?: string; success?: string };

const initialState: AdminActionState = {};

async function addCharityFormAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const result = await addCharityAction(formData);
  if (result?.error) {
    return { error: result.error };
  }
  return { success: "Charity added." };
}

export default function AddCharityForm() {
  const [state, formAction, isPending] = useActionState(
    addCharityFormAction,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex items-center gap-2"
    >
      <Input name="name" placeholder="Charity name" required />
      <Input name="description" placeholder="Description" />
      <Button type="submit" disabled={isPending}>
        Add charity
      </Button>
      {state.error && <p className="text-sm text-accent">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-success">{state.success}</p>
      )}
    </form>
  );
}
