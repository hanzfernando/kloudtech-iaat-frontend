import React from "react";
import { Lock, Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type LoginFormProps = {
  email: string;
  password: string;
  error?: string | null;
  isPending?: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  error,
  isPending,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) => {
  return (
    <>
      {error && (
        <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
          {error}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-muted-foreground">
            Email
          </Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Mail size={16} />
            </span>
            <Input id="email" type="email" className="pl-9" value={email} onChange={onEmailChange} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-muted-foreground">
            Password
          </Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Lock size={16} />
            </span>
            <Input id="password" type="password" className="pl-9" value={password} onChange={onPasswordChange} required />
          </div>
        </div>
        {/* <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" className="h-4 w-4 rounded border-input" />
            Remember me
          </label>
          <a href="#" className="text-sm text-primary underline-offset-4 hover:underline">
            Forgot password?
          </a>
        </div> */}
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Logging in..." : "Login"}
        </Button>
      </form>
    </>
  );
};

export default LoginForm;
