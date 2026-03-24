import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/scores", label: "Scores" },
  { href: "/draw", label: "Draw" },
  { href: "/charity", label: "Charity" },
  { href: "/winnings", label: "Winnings" },
  { href: "/subscription", label: "Subscription" },
  { href: "/settings", label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="hidden h-screen w-[260px] flex-col gap-6 border-r border-border/70 bg-surface-1/90 px-6 py-8 lg:flex">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-text-muted">
          Golf Charity
        </p>
        <h2 className="mt-2 text-xl font-semibold">Member Portal</h2>
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-surface-2/70 hover:text-text-primary"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="space-y-2 text-xs text-text-muted">
        <p>Subscription required</p>
        <p>Charity-first draws</p>
      </div>
    </aside>
  );
}
