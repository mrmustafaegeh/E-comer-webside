import { Suspense } from "react";
import RegisterForm from "../../../Component/auth/RegisterForm";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[var(--bg-subtle)]">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--text-muted)]" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
