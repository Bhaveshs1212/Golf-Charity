import Card from "@/components/ui/Card";
import ScoreForm from "@/components/scores/ScoreForm";
import ScoreBall from "@/components/scores/ScoreBall";
import SubscriptionGate from "@/components/auth/SubscriptionGate";
import { requireUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";
import { getSubscriptionStatus } from "@/lib/subscription";

export default async function ScoresPage() {
  const user = await requireUser();
  const supabase = getServerSupabase();
  if (!supabase) {
    throw new Error("Supabase not configured");
  }
  const subscriptionStatus = await getSubscriptionStatus(user?.id || "");
  const isSubscriber = subscriptionStatus === "active";
  const { data: scores } = await supabase
    .from("scores")
    .select("id, value")
    .eq("user_id", user?.id || "")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.6fr_1fr]">
      <Card className="p-6">
        <h2 className="text-[22px] font-semibold">Log a new score</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Add a score between 1 and 45. Only the latest five are retained.
        </p>
        <div className="mt-6">
          <ScoreForm disabled={!isSubscriber} />
        </div>
        {!isSubscriber && (
          <div className="mt-6">
            <SubscriptionGate />
          </div>
        )}
      </Card>
      <Card className="p-6">
        <h2 className="text-[22px] font-semibold">Your rolling scores</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Latest entries appear first.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {scores?.length
            ? scores.map((score) => (
                <ScoreBall key={score.id} value={score.value} />
              ))
            : (
                <p className="text-sm text-text-muted">
                  No scores yet.
                </p>
              )}
        </div>
      </Card>
    </div>
  );
}
