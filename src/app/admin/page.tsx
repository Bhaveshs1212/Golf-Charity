import Link from "next/link";

import Card from "@/components/ui/Card";

const panels = [
  { href: "/admin/users", label: "Users" },
  { href: "/admin/draws", label: "Draws" },
  { href: "/admin/winners", label: "Winners" },
  { href: "/admin/charities", label: "Charities" },
];

export default function AdminHomePage() {
  return (
    <Card className="p-6">
      <h2 className="text-[22px] font-semibold">Admin dashboard</h2>
      <p className="mt-2 text-sm text-text-secondary">
        Select a panel to manage the platform.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {panels.map((panel) => (
          <Link
            key={panel.href}
            href={panel.href}
            className="rounded-2xl border border-border/70 bg-surface-2/70 px-4 py-3 text-sm font-medium text-text-primary transition hover:bg-surface-3/80"
          >
            {panel.label}
          </Link>
        ))}
      </div>
    </Card>
  );
}
