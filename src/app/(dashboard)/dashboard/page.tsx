import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import ScoreBall from "@/components/scores/ScoreBall";
import DrawNumbers from "@/components/draw/DrawNumbers";
import ImpactChart from "@/components/charts/ImpactChart";
import { requireUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = getServerSupabase();
  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("subscription_status, donation_percentage, charity_id")
    .eq("id", user?.id || "")
    .single();

  const { data: charity } = await supabase
    .from("charities")
    .select("name")
    .eq("id", profile?.charity_id || "")
    .maybeSingle();

  const { data: scores } = await supabase
    .from("scores")
    .select("id, value")
    .eq("user_id", user?.id || "")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: draw } = await supabase
    .from("draws")
    .select("numbers, month")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .single();

  const drawNumbers = (draw?.numbers as number[] | undefined) || [];
  const recentScores = scores?.map((score) => score.value) || [];
  const matchCount = drawNumbers.filter((num: number) => recentScores.includes(num))
    .length;
  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
            Subscription
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Badge variant={profile?.subscription_status === "active" ? "active" : "inactive"}>
              {profile?.subscription_status || "inactive"}
            </Badge>
            <span className="text-sm text-text-secondary">Billing via Stripe</span>
          </div>
          <p className="mt-4 text-3xl font-semibold">$9.99 / month</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
            Charity
          </p>
          <p className="mt-4 text-2xl font-semibold">
            {charity?.name || "No charity selected"}
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            Donation rate: {profile?.donation_percentage ?? 10}%
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
            Next draw
          </p>
          <p className="mt-4 text-3xl font-semibold">
            {draw?.month || "Pending"}
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            Publish time: 8:00 PM
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
                Rolling scores
              </p>
              <h2 className="mt-2 text-[22px] font-semibold">Last 5 rounds</h2>
            </div>
            <span className="text-sm text-text-secondary">
              Matches {matchCount} numbers
            </span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {scores?.length
              ? scores.map((score) => (
                  <ScoreBall key={score.id} value={score.value} />
                ))
              : (
                  <p className="text-sm text-text-muted">No scores yet.</p>
                )}
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
            Latest draw
          </p>
          <h2 className="mt-2 text-[22px] font-semibold">March 31 results</h2>
          <div className="mt-4">
            {drawNumbers.length ? (
              <DrawNumbers numbers={drawNumbers} />
            ) : (
              <p className="text-sm text-text-muted">No draw published.</p>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
              Charity impact
            </p>
            <h2 className="mt-2 text-[22px] font-semibold">Year-to-date</h2>
          </div>
          <p className="text-sm text-text-secondary">$12,480 donated</p>
        </div>
        <div className="mt-6">
          <ImpactChart />
        </div>
      </Card>
    </div>
  );
}
