"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import { getBrowserSupabase } from "@/lib/supabase/client";

export default function ProofUpload({
  winnerId,
}: {
  winnerId: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Select a file first.");
      return;
    }

    const supabase = getBrowserSupabase();
    if (!supabase) {
      setMessage("Supabase not configured.");
      return;
    }

    const path = `${winnerId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("proofs").upload(path, file, {
      upsert: true,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    const { data } = supabase.storage.from("proofs").getPublicUrl(path);
    const response = await fetch("/api/winners/proof", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ winnerId, proofUrl: data.publicUrl }),
    });
    const result = await response.json();

    if (!response.ok || result?.error) {
      setMessage(result?.error || "Upload failed.");
    } else {
      setMessage("Proof uploaded.");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        className="input"
        type="file"
        onChange={(event) => setFile(event.target.files?.[0] || null)}
      />
      <Button onClick={handleUpload}>Submit proof</Button>
      {message && <p className="text-sm text-text-muted">{message}</p>}
    </div>
  );
}
