import Card from "@/components/ui/Card";
import CharityPicker from "@/components/charity/CharityPicker";
import { requireUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";

export default async function CharityPage() {
  const user = await requireUser();
  const supabase = getServerSupabase();
  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  const { data: charities } = await supabase
    .from("charities")
    .select("id, name")
    .eq("active", true)
    .order("name", { ascending: true });

  const { data: profile } = await supabase
    .from("users")
    .select("charity_id, donation_percentage")
    .eq("id", user?.id || "")
    .single();

  const selectedCharity = charities?.find((item) => item.id === profile?.charity_id);
  return (
    <div className="grid gap-6 lg:grid-cols-[0.6fr_1fr]">
      <Card className="p-6">
        <h2 className="text-[22px] font-semibold">Your charity impact</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Configure the charity receiving your monthly contribution.
        </p>
        <div className="mt-6">
          <CharityPicker
            charities={charities || []}
            selectedId={profile?.charity_id || null}
            donationPercentage={profile?.donation_percentage || 10}
          />
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-[22px] font-semibold">Impact summary</h3>
        <p className="mt-2 text-sm text-text-secondary">
          Total contributed this year: $620.00
        </p>
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-border/70 bg-surface-2/70 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
              Current charity
            </p>
            <p className="mt-2 text-lg font-semibold">
              {selectedCharity?.name || "No charity selected"}
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-surface-2/70 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
              Donation rate
            </p>
            <p className="mt-2 text-lg font-semibold">
              {profile?.donation_percentage ?? 10}% of fee
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
