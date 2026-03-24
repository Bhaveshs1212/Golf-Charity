import Card from "@/components/ui/Card";
import AddCharityForm from "@/components/admin/AddCharityForm";
import { getServerSupabase } from "@/lib/supabase/server";

export default async function AdminCharitiesPage() {
  const supabase = getServerSupabase();
  if (!supabase) {
    throw new Error("Supabase not configured");
  }
  const { data: charities } = await supabase
    .from("charities")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-semibold">Charities</h2>
        <AddCharityForm />
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {charities?.length ? (
          charities.map((charity) => (
            <div
              key={charity.id}
              className="rounded-2xl border border-border/70 bg-surface-2/70 px-4 py-3 text-sm text-text-secondary"
            >
              {charity.name}
            </div>
          ))
        ) : (
          <p className="text-sm text-text-muted">No charities yet.</p>
        )}
      </div>
    </Card>
  );
}
