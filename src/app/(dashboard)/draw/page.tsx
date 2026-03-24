import Card from "@/components/ui/Card";
import DrawNumbers from "@/components/draw/DrawNumbers";
import Badge from "@/components/ui/Badge";
import SubscriptionGate from "@/components/auth/SubscriptionGate";
import { requireUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";
import { getSubscriptionStatus } from "@/lib/subscription";

export default async function DrawPage() {
  const user = await requireUser();
  const supabase = getServerSupabase();
  if (!supabase) {
    throw new Error("Supabase not configured");
  }
  const subscriptionStatus = await getSubscriptionStatus(user?.id || "");
  const isSubscriber = subscriptionStatus === "active";
  const { data: draw } = await supabase
    .from("draws")
    .select("id, numbers, month")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .single();

  const { data: scores } = await supabase
    .from("scores")
    .select("value")
    .eq("user_id", user?.id || "")
    .order("created_at", { ascending: false })
    .limit(5);

  const userScores = scores?.map((score) => score.value) || [];
  const drawNumbers = (draw?.numbers as number[] | undefined) || [];
  const matches = drawNumbers.filter((num: number) => userScores.includes(num));

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
              Current draw
            </p>
            <h2 className="mt-2 text-[22px] font-semibold">
              {draw?.month || "No draw published"}
            </h2>
          </div>
          <Badge variant="jackpot">Jackpot tier</Badge>
        </div>
        <div className="mt-6">
          {drawNumbers.length ? (
            <DrawNumbers numbers={drawNumbers} />
          ) : (
            <p className="text-sm text-text-muted">
              Draw numbers will appear after publish.
            </p>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-[22px] font-semibold">Your matches</h3>
        <p className="mt-2 text-sm text-text-secondary">
          Matches are calculated against your rolling five scores.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {isSubscriber ? (
            matches.map((match: number) => (
              <span
                key={match}
                className="rounded-full border border-border/70 bg-surface-3/70 px-4 py-2 text-sm font-semibold text-success"
              >
                {match}
              </span>
            ))
          ) : (
            <span className="text-sm text-text-muted">
              Subscribe to participate in this month's draw.
            </span>
          )}
          {isSubscriber && matches.length === 0 && (
            <span className="text-sm text-text-muted">
              No matches this month.
            </span>
          )}
        </div>
        {!isSubscriber && (
          <div className="mt-6">
            <SubscriptionGate />
          </div>
        )}
      </Card>
    </div>
  );
}
