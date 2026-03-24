import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import SubscriptionActions from "@/components/subscription/SubscriptionActions";
import { requireUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";

export default async function SubscriptionPage() {
  const user = await requireUser();
  const supabase = getServerSupabase();
  if (!supabase) {
    throw new Error("Supabase not configured");
  }
  const { data: profile } = await supabase
    .from("users")
    .select("subscription_status, subscription_plan")
    .eq("id", user?.id || "")
    .single();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
              Status
            </p>
            <h2 className="mt-2 text-[22px] font-semibold">
              {profile?.subscription_status || "inactive"}
            </h2>
          </div>
          <Badge
            variant={
              profile?.subscription_status === "active" ? "active" : "inactive"
            }
          >
            {profile?.subscription_status === "active" ? "Paid" : "Inactive"}
          </Badge>
        </div>
        <p className="mt-4 text-sm text-text-secondary">
          Plan: {profile?.subscription_plan || "Not set"}
        </p>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-[22px] font-semibold">Monthly</h3>
          <p className="mt-2 text-3xl font-semibold text-primary">$9.99</p>
          <SubscriptionActions plan="monthly" label="Choose monthly" />
        </Card>
        <Card className="p-6">
          <h3 className="text-[22px] font-semibold">Yearly</h3>
          <p className="mt-2 text-3xl font-semibold text-primary">$99.99</p>
          <SubscriptionActions plan="yearly" label="Choose yearly" />
        </Card>
      </div>
    </div>
  );
}
