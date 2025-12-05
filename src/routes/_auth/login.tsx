import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useLogin } from "@/lib/query/auth/mutations";
import { useAuth } from "@/providers/AuthProvider";
import ThemeButton from "@/components/ThemeButton";
import LoginForm from "@/components/login/LoginForm";

export const Route = createFileRoute("/_auth/login")({
  beforeLoad: ({ context }) => {
    const { isAuthenticated } = context.authentication;

    console.log("Checking authentication status in /_auth/login route");
    console.log("isAuthenticated:", isAuthenticated);
    if (isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const { mutateAsync: login, isPending } = useLogin();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ email, password });
      // Navigate immediately after successful login
      navigate({ to: "/dashboard", replace: true });
    } catch (err: any) {
      const message = err?.response?.data?.message || "Login failed";
      setError(message);
    }
  };

  // Fallback: if auth flips to true due to query invalidation, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Brand gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-muted to-background" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      {/* Auth card */}
      <div className="mx-auto flex max-w-6xl items-center px-4 py-8 md:py-16">
        {/* Centered form */}
        <div className="mx-auto flex w-full flex-col">
          <div className="rounded-2xl relative min-w-2xl max-w-4xl border bg-card p-6 shadow-sm">
            <ThemeButton className="absolute top-4 right-4 rounded-full"/>

            {/* Title and subtitle at top */}
            <div className="mb-6">
              <div className="flex items-center justify-center">
                <h2 className="text-2xl text-center font-semibold text-primary">Kloudtech Inventory and Asset Management</h2>
              </div>
              <p className="mt-2 text-sm text-center text-muted-foreground">
                Please enter your details to continue.
              </p>
            </div>
            <LoginForm
              email={email}
              password={password}
              error={error}
              isPending={isPending}
              onEmailChange={(e) => setEmail(e.target.value)}
              onPasswordChange={(e) => setPassword(e.target.value)}
              onSubmit={onSubmit}
            />
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don’t have an account? <a className="text-primary underline-offset-4 hover:underline" href="#">Contact admin</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
