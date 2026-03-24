import Card from "@/components/ui/Card";
import WinningsTable from "@/components/winnings/WinningsTable";
import ProofUpload from "@/components/winnings/ProofUpload";
import { requireUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/format";

export default async function WinningsPage() {
  const user = await requireUser();
  const supabase = getServerSupabase();
  if (!supabase) {
    throw new Error("Supabase not configured");
  }
  const { data: winners } = await supabase
    .from("winners")
    .select("id, matches, prize_amount, status, proof_url, draw:draw_id(month)")
    .eq("user_id", user?.id || "")
    .order("created_at", { ascending: false });

  const rows =
    winners?.map((winner) => {
      const draw = Array.isArray(winner.draw) ? winner.draw[0] : winner.draw;
      return {
        id: draw?.month || winner.id,
        match: winner.matches,
        amount: formatCurrency(winner.prize_amount || 0),
        status: winner.status,
        proofUrl: winner.proof_url,
        winnerId: winner.id,
      };
    }) || [];

  const tableRows = rows.map((row) => ({
    id: row.id,
    match: row.match,
    amount: row.amount,
    status: row.status,
  }));
  const uploadRows = rows.filter((row) => !row.proofUrl);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-[22px] font-semibold">Payout history</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Track winning tiers and upload proof for verification.
        </p>
        <div className="mt-6">
          <WinningsTable winnings={tableRows} />
        </div>
      </Card>
      {uploadRows.map((row) => (
          <Card key={row.winnerId} className="p-6">
            <h3 className="text-[22px] font-semibold">Upload proof</h3>
            <p className="mt-2 text-sm text-text-secondary">
              Draw {row.id}: upload verification for your payout.
            </p>
            <div className="mt-4">
              <ProofUpload winnerId={row.winnerId} />
            </div>
          </Card>
        ))}
    </div>
  );
}
