import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const oauthError = url.searchParams.get("error");
  const origin = url.origin;

  if (oauthError || !code) {
    return NextResponse.redirect(new URL("/login?error=auth_failed", origin));
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(new URL("/login?error=auth_failed", origin));
    }
    return NextResponse.redirect(new URL("/chat", origin));
  } catch {
    return NextResponse.redirect(new URL("/login?error=auth_failed", origin));
  }
}
