import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useLogin } from "@/lib/query/auth/mutations";
import { useAuth } from "@/providers/AuthProvider";

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Login</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm">Email</label>
          <input
            id="email"
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm">Password</label>
          <input
            id="password"
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-black text-white rounded px-3 py-2 disabled:opacity-50"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
