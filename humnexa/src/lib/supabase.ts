"use client";

import { createBrowserClient } from "@supabase/ssr";

interface SupabasePublicEnv {
  url: string;
  anonKey: string;
}

function getSupabasePublicEnv(): SupabasePublicEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  return { url, anonKey };
}

export function createSupabaseClient() {
  const { url, anonKey } = getSupabasePublicEnv();
  return createBrowserClient(url, anonKey);
}

export async function signInWithGoogle(redirectPath = "/chat") {
  const supabase = createSupabaseClient();
  const redirectTo = typeof window !== "undefined" ? `${window.location.origin}${redirectPath}` : redirectPath;

  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
}
