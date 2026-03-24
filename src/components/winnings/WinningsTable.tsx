import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

type WinningRow = {
  id: string;
  match: number;
  amount: string;
  status: "pending" | "verified" | "paid";
};

export default function WinningsTable({ winnings }: { winnings: WinningRow[] }) {
  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-4 gap-2 border-b border-border/70 bg-surface-2/80 px-6 py-4 text-xs uppercase tracking-[0.2em] text-text-muted">
        <span>Draw</span>
        <span>Matches</span>
        <span>Amount</span>
        <span>Status</span>
      </div>
      <div className="divide-y divide-border/70">
        {winnings.length ? (
          winnings.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-4 gap-2 px-6 py-4 text-sm text-text-secondary"
          >
            <span className="text-text-primary">{row.id}</span>
            <span>{row.match}</span>
            <span>{row.amount}</span>
            <Badge
              variant={
                row.status === "paid"
                  ? "paid"
                  : row.status === "verified"
                    ? "active"
                    : "pending"
              }
            >
              {row.status}
            </Badge>
          </div>
          ))
        ) : (
          <div className="px-6 py-6 text-sm text-text-muted">
            No winnings yet.
          </div>
        )}
      </div>
    </Card>
  );
}
