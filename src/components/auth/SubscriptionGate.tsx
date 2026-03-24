import Link from "next/link";
import Card from "@/components/ui/Card";

export default function SubscriptionGate() {
  return (
    <Card className="p-6">
      <h3 className="text-[22px] font-semibold">Subscription required</h3>
      <p className="mt-2 text-sm text-text-secondary">
        Activate a monthly or yearly plan to unlock scores, draws, and charity
        contributions.
      </p>
      <Link className="btn btn-primary mt-4" href="/subscription">
        Manage subscription
      </Link>
    </Card>
  );
}
