import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

export default function SettingsPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.6fr_1fr]">
      <Card className="p-6">
        <h2 className="text-[22px] font-semibold">Profile</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Manage your account details.
        </p>
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-text-secondary">Email</label>
            <Input type="email" defaultValue="user@test.com" />
          </div>
          <div>
            <label className="text-sm text-text-secondary">Password</label>
            <Input type="password" placeholder="Update password" />
          </div>
          <Button>Save changes</Button>
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-[22px] font-semibold">Notifications</h3>
        <p className="mt-2 text-sm text-text-secondary">
          Control how we notify you about draws and winnings.
        </p>
        <div className="mt-6 space-y-4 text-sm text-text-secondary">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked /> Email me draw updates
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked /> Notify me of payouts
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" /> Product updates
          </label>
        </div>
      </Card>
    </div>
  );
}
