"use client";

import { useState, useTransition } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { addScoreAction } from "@/app/actions/score-actions";
import { SCORE_MAX, SCORE_MIN } from "@/lib/constants";

export default function ScoreForm({ disabled }: { disabled?: boolean }) {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled) {
      setMessage("Subscribe to unlock score submissions.");
      return;
    }
    setMessage(null);

    startTransition(async () => {
      const result = await addScoreAction(Number(value));
      if (result?.error) {
        setMessage(result.error);
      } else {
        setMessage("Score logged.");
        setValue("");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-text-secondary">Round score</label>
        <Input
          type="number"
          min={SCORE_MIN}
          max={SCORE_MAX}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Enter score 1-45"
          disabled={disabled}
        />
      </div>
      <Button disabled={isPending || disabled}>Log score</Button>
      {message && <p className="text-sm text-text-muted">{message}</p>}
    </form>
  );
}
