"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Route } from "next";
import { Mail, Lock } from "lucide-react";
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

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/chat`,
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

  const signInWithEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      showToast({ variant: "success", message: "Welcome back!" });
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
    <Card className="w-full max-w-md border-white/20 bg-white/95 dark:bg-brand-card-dark/95" padding="lg">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl gradient-brand text-xl font-bold text-white">
          H
        </div>
        <h1 className="text-2xl font-semibold">Welcome Back</h1>
        <p className="mt-1 text-sm text-brand-text-secondary">Log in to continue with Humnexa AI.</p>
      </div>

      <Button variant="outline" fullWidth isLoading={isLoading} onClick={signInWithGoogle}>
        <span className="inline-flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.7 3.7 14.6 3 12 3 7 3 3 7 3 12s4 9 9 9c5.2 0 8.6-3.6 8.6-8.7 0-.6-.1-1-.2-1.4z" />
          </svg>
          Continue with Google
        </span>
      </Button>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-brand-border-light dark:bg-brand-border-dark" />
        <span className="text-xs uppercase tracking-wide text-brand-text-secondary">or continue with email</span>
        <div className="h-px flex-1 bg-brand-border-light dark:bg-brand-border-dark" />
      </div>

      <form className="space-y-4" onSubmit={signInWithEmail}>
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          leftIcon={<Mail className="h-4 w-4" />}
        />
        <Input
          label="Password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          leftIcon={<Lock className="h-4 w-4" />}
        />
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-brand-primary hover:underline">
            Forgot Password?
          </Link>
        </div>
        <Button type="submit" fullWidth isLoading={isLoading}>
          Login
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-brand-text-secondary">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-brand-primary hover:underline">
          Sign up
        </Link>
      </p>
    </Card>
  );
}
