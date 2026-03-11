"use client";

import { createSupabaseClient } from "@/lib/supabase";

export function createClient() {
  return createSupabaseClient();
}
