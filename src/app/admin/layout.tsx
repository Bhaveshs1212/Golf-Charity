import AdminSidebar from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-base text-primary">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border/70 bg-surface-1/80 px-6 py-4 backdrop-blur-xl">
          <p className="text-sm text-text-muted">Admin controls</p>
          <h1 className="text-[28px] font-semibold">Platform oversight</h1>
        </header>
        <main className="flex-1 space-y-8 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
