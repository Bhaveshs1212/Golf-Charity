import Link from "next/link";

const adminItems = [
  { href: "/admin/users", label: "Users" },
  { href: "/admin/draws", label: "Draws" },
  { href: "/admin/winners", label: "Winners" },
  { href: "/admin/charities", label: "Charities" },
];

export default function AdminSidebar() {
  return (
    <aside className="hidden h-screen w-[260px] flex-col gap-6 border-r border-border/70 bg-surface-1/90 px-6 py-8 lg:flex">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-text-muted">
          Golf Charity
        </p>
        <h2 className="mt-2 text-xl font-semibold">Admin Panel</h2>
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {adminItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-surface-2/70 hover:text-text-primary"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
