import Sidebar from "@/components/navigation/Sidebar";
import Topbar from "@/components/navigation/Topbar";
import SubscriptionGate from "@/components/auth/SubscriptionGate";
import { requireUser } from "@/lib/auth";
import { getSubscriptionStatus } from "@/lib/subscription";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const subscriptionStatus = user
    ? await getSubscriptionStatus(user.id)
    : "inactive";

  return (
    <div className="flex min-h-screen bg-base text-primary">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 space-y-8 px-6 py-8">
          {subscriptionStatus === "active" ? children : <SubscriptionGate />}
        </main>
      </div>
    </div>
  );
}
