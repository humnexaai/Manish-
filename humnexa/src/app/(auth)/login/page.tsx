"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Route } from "next";
import { Chrome, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { showToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/chat");

  useEffect(() => {
    const next = new URLSearchParams(window.location.search).get("next");
    if (next && next.startsWith("/")) setRedirectPath(next);
  }, []);

  const continueWithGoogle = async () => {
    try {
      setIsLoading(true);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      showToast({
        variant: "error",
        message: error instanceof Error ? error.message : "Unable to sign in with Google.",
      });
      setIsLoading(false);
    }
  };

  const loginWithEmail = async () => {
    if (!email.trim() || !password) {
      showToast({ variant: "warning", message: "Email and password are required." });
      return;
    }
    try {
      setIsLoading(true);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      const safeRedirect = redirectPath.startsWith("/") ? redirectPath : "/chat";
      router.push(safeRedirect as Route);
      router.refresh();
    } catch (error) {
      showToast({
        variant: "error",
        message: error instanceof Error ? error.message : "Invalid credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-2 border-brand-primary/30 bg-white text-brand-text-light shadow-2xl dark:border-brand-primary/40 dark:bg-brand-card-dark dark:text-brand-text-dark" padding="lg">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-primary text-2xl font-bold text-white shadow-lg">
          G
        </div>
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-2 text-sm text-brand-text-secondary">Continue securely with your Google account.</p>
      </div>

      <Button
        fullWidth
        isLoading={isLoading}
        onClick={continueWithGoogle}
        className="h-11 text-base font-semibold"
        leftIcon={<Chrome className="h-4 w-4" />}
      >
        <span className="inline-flex items-center gap-2">
          Sign in with Google
        </span>
      </Button>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-brand-border-light dark:bg-brand-border-dark" />
        <span className="text-xs uppercase tracking-wide text-brand-text-secondary">or continue with email</span>
        <div className="h-px flex-1 bg-brand-border-light dark:bg-brand-border-dark" />
      </div>

      <div className="space-y-3">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          leftIcon={<Mail className="h-4 w-4" />}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          leftIcon={<Lock className="h-4 w-4" />}
          required
        />
        <Button fullWidth isLoading={isLoading} onClick={loginWithEmail}>
          Login with Email
        </Button>
      </div>

      <div className="mt-6 rounded-lg border border-brand-border-light bg-brand-card-light p-3 text-center text-xs text-brand-text-secondary dark:border-brand-border-dark dark:bg-brand-bg-dark">
        Google is the primary login method for fastest setup and support.
      </div>

      <p className="mt-5 text-center text-sm text-brand-text-secondary">
        Need to create a new account?{" "}
        <button
          type="button"
          className="font-medium text-brand-primary hover:underline"
          onClick={() => {
            const safeRedirect = redirectPath.startsWith("/") ? redirectPath : "/chat";
            router.push(`/signup?next=${encodeURIComponent(safeRedirect)}` as Route);
          }}
        >
          Continue to signup
        </button>
      </p>
    </Card>
  );
}
