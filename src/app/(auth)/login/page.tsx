import Card from "@/components/ui/Card";
import AuthForm from "@/components/auth/AuthForm";
import { signInAction } from "@/app/actions/auth-actions";

export default function LoginPage() {
  return (
    <Card className="p-8">
      <h1 className="text-[36px] font-semibold">Welcome back</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Log in to manage your subscription and scores.
      </p>
      <AuthForm action={signInAction} mode="login" />
    </Card>
  );
}
