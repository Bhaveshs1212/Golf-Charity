import Card from "@/components/ui/Card";
import AuthForm from "@/components/auth/AuthForm";
import { signUpAction } from "@/app/actions/auth-actions";

export default function SignupPage() {
  return (
    <Card className="p-8">
      <h1 className="text-[36px] font-semibold">Create your account</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Start a subscription and select a charity to support.
      </p>
      <AuthForm action={signUpAction} mode="signup" />
    </Card>
  );
}
