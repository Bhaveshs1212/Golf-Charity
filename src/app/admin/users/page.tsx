import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getServerSupabase } from "@/lib/supabase/server";

export default async function AdminUsersPage() {
  const supabase = getServerSupabase();
  if (!supabase) {
    throw new Error("Supabase not configured");
  }
  const { data: users } = await supabase
    .from("users")
    .select("id, email, subscription_status")
    .order("created_at", { ascending: false });

  return (
    <Card className="p-6">
      <h2 className="text-[22px] font-semibold">Members</h2>
      <div className="mt-6 space-y-3">
        {users?.length ? (
          users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-2xl border border-border/70 bg-surface-2/70 px-4 py-3"
          >
            <div>
              <p className="text-sm text-text-primary">{user.email}</p>
              <p className="text-xs text-text-muted">Member</p>
            </div>
            <Badge
              variant={
                user.subscription_status === "active" ? "active" : "inactive"
              }
            >
              {user.subscription_status}
            </Badge>
          </div>
          ))
        ) : (
          <p className="text-sm text-text-muted">No members yet.</p>
        )}
      </div>
    </Card>
  );
}
