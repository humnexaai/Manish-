"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseUrl = envUrl?.startsWith("http") ? envUrl : "https://example.supabase.co";
  const supabaseAnonKey = envKey && envKey !== "your_anon_key" ? envKey : "public-anon-key";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
