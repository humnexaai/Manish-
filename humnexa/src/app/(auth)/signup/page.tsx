"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { Route } from "next";
import { Lock, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { showToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 35;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 20;
  if (/[^A-Za-z0-9]/.test(password)) score += 25;
  return Math.min(score, 100);
}

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const strengthLabel = strength >= 80 ? "Strong" : strength >= 50 ? "Medium" : "Weak";

  const signUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!acceptedTerms) {
      showToast({ variant: "warning", message: "Please accept Terms and Privacy Policy." });
      return;
    }
    try {
      setIsLoading(true);
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone ? `+91${phone}` : "",
          },
        },
      });
      if (error) throw error;
      showToast({
        variant: "success",
        message: "Signup successful. Check your email for verification link (if enabled).",
      });
      router.push("/chat" as Route);
      router.refresh();
    } catch (error) {
      showToast({
        variant: "error",
        message: error instanceof Error ? error.message : "Unable to create account.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <Card className="w-full max-w-md border-white/20 bg-white/95 dark:bg-brand-card-dark/95" padding="lg">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl gradient-brand text-xl font-bold text-white">
          H
        </div>
        <h1 className="text-2xl font-semibold">Create Account</h1>
        <p className="mt-1 text-sm text-brand-text-secondary">Start your Hindi-first AI journey today.</p>
      </div>

      <Button variant="outline" fullWidth isLoading={isLoading} onClick={continueWithGoogle}>
        <span className="inline-flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.7 3.7 14.6 3 12 3 7 3 3 7 3 12s4 9 9 9c5.2 0 8.6-3.6 8.6-8.7 0-.6-.1-1-.2-1.4z" />
          </svg>
          Continue with Google
        </span>
      </Button>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-brand-border-light dark:bg-brand-border-dark" />
        <span className="text-xs uppercase tracking-wide text-brand-text-secondary">or sign up with email</span>
        <div className="h-px flex-1 bg-brand-border-light dark:bg-brand-border-dark" />
      </div>

      <form className="space-y-4" onSubmit={signUp}>
        <Input label="Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} leftIcon={<User className="h-4 w-4" />} />
        <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} leftIcon={<Mail className="h-4 w-4" />} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-text-light dark:text-brand-text-dark">Phone</label>
          <div className="flex items-center gap-2">
            <span className="rounded-lg border border-brand-border-light px-3 py-2 text-sm dark:border-brand-border-dark">+91</span>
            <Input
              className="flex-1"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="h-4 w-4" />}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="h-4 w-4" />}
          />
          <ProgressBar value={strength} size="sm" />
          <p className="text-xs text-brand-text-secondary">Strength: {strengthLabel}</p>
        </div>

        <label className="flex items-start gap-2 text-sm text-brand-text-secondary">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-brand-border-light text-brand-primary focus:ring-brand-primary"
          />
          <span>
            I agree to{" "}
            <Link href="/terms" className="text-brand-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-brand-primary hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label>

        <Button type="submit" fullWidth isLoading={isLoading}>
          Sign Up
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-brand-text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand-primary hover:underline">
          Log in
        </Link>
      </p>
    </Card>
  );
}
