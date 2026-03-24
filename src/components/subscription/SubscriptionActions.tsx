"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";

export default function SubscriptionActions({
  plan,
  label,
}: {
  plan: "monthly" | "yearly";
  label: string;
}) {
  const [loading, setLoading] = useState(false);

  const startCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await response.json();
      if (data?.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button className="mt-6 w-full" onClick={startCheckout} disabled={loading}>
      {loading ? "Redirecting..." : label}
    </Button>
  );
}
