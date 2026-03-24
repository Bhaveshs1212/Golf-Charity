import Card from "@/components/ui/Card";
import DrawNumbers from "@/components/draw/DrawNumbers";
import PublishDrawForm from "@/components/admin/PublishDrawForm";
import { getServerSupabase } from "@/lib/supabase/server";

export default async function AdminDrawsPage() {
  const supabase = getServerSupabase();
  if (!supabase) {
    throw new Error("Supabase not configured");
  }
  const { data: currentDraw } = await supabase
    .from("draws")
    .select("month, numbers, status")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: history } = await supabase
    .from("draws")
    .select("id, month, status")
    .order("created_at", { ascending: false })
    .limit(5);

  const drawNumbers = currentDraw?.numbers || [];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[22px] font-semibold">Current draw</h2>
          <PublishDrawForm />
        </div>
        <div className="mt-6">
          {drawNumbers.length ? (
            <DrawNumbers numbers={drawNumbers} />
          ) : (
            <p className="text-sm text-text-muted">No draw generated yet.</p>
          )}
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-[22px] font-semibold">Draw history</h3>
        <div className="mt-4 space-y-3">
          {history?.length ? (
            history.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-border/70 bg-surface-2/70 px-4 py-3 text-sm text-text-secondary"
              >
                {item.month} - {item.status}
              </div>
            ))
          ) : (
            <p className="text-sm text-text-muted">No draws yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
