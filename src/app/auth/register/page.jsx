import { Suspense } from "react";
import RegisterForm from "../../../Component/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<div className="text-white font-mono uppercase tracking-widest text-xs">Authenticating...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
