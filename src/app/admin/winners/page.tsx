import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import WinnerStatusForm from "@/components/admin/WinnerStatusForm";
import { getServerSupabase } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/format";

export default async function AdminWinnersPage() {
  const supabase = getServerSupabase();
  if (!supabase) {
    throw new Error("Supabase not configured");
  }
  const { data: winners } = await supabase
    .from("winners")
    .select("id, matches, status, prize_amount, user:users(email)")
    .order("created_at", { ascending: false });

  return (
    <Card className="p-6">
      <h2 className="text-[22px] font-semibold">Winners</h2>
      <div className="mt-6 space-y-3">
        {winners?.length ? (
          winners.map((winner) => {
            const user = Array.isArray(winner.user) ? winner.user[0] : winner.user;
            return (
              <div
                key={winner.id}
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-surface-2/70 px-4 py-3"
              >
                <div>
                  <p className="text-sm text-text-primary">
                    {user?.email || "Unknown"}
                  </p>
                  <p className="text-xs text-text-muted">
                    {winner.matches} matches · {formatCurrency(winner.prize_amount || 0)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={winner.status === "paid" ? "paid" : "pending"}>
                    {winner.status}
                  </Badge>
                  {winner.status !== "paid" && (
                    <WinnerStatusForm winnerId={winner.id} />
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-text-muted">No winners yet.</p>
        )}
      </div>
    </Card>
  );
}
