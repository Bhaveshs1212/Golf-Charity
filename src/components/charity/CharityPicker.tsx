"use client";

import { useState, useTransition } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { updateCharityAction } from "@/app/actions/charity-actions";

type CharityOption = { id: string; name: string };

export default function CharityPicker({
  charities,
  selectedId,
  donationPercentage,
}: {
  charities: CharityOption[];
  selectedId: string | null;
  donationPercentage: number;
}) {
  const [selected, setSelected] = useState(selectedId || charities[0]?.id || "");
  const [percentage, setPercentage] = useState(donationPercentage || 10);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await updateCharityAction({
        charityId: selected,
        donationPercentage: percentage,
      });

      if (result?.error) {
        setMessage(result.error);
      } else {
        setMessage("Charity preference saved.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-text-secondary">Selected charity</label>
        <select
          className="input"
          value={selected}
          onChange={(event) => setSelected(event.target.value)}
        >
          {charities.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-text-secondary">
          Donation percentage
        </label>
        <Input
          type="number"
          min={5}
          max={30}
          value={percentage}
          onChange={(event) => setPercentage(Number(event.target.value))}
        />
      </div>
      <Button disabled={isPending}>Save charity settings</Button>
      {message && <p className="text-sm text-text-muted">{message}</p>}
    </form>
  );
}
