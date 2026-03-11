import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthInitializer } from "@/components/providers/AuthInitializer";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@/types";

export default async function ProtectedAppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));

  if (!authUser) {
    redirect("/login");
  }

  const profileSeed = {
    id: authUser.id,
    full_name: (authUser.user_metadata?.full_name as string | undefined) ?? null,
    avatar_url: (authUser.user_metadata?.avatar_url as string | undefined) ?? null,
    phone: authUser.phone ?? null,
  };

  await supabase.from("profiles").upsert(profileSeed, { onConflict: "id" }).select("id").maybeSingle();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", authUser.id).maybeSingle();

  const user: User = {
    id: authUser.id,
    email: authUser.email ?? "",
    full_name: (profile?.full_name as string | null) ?? (authUser.user_metadata?.full_name as string | null) ?? "User",
    phone: (profile?.phone as string | null) ?? (authUser.phone as string | null) ?? null,
    avatar_url: (profile?.avatar_url as string | null) ?? null,
    role: (profile?.role as User["role"]) ?? "user",
    plan: (profile?.plan as User["plan"]) ?? "free",
    plan_expires_at: (profile?.plan_expires_at as string | null) ?? null,
    language: (profile?.language as string) ?? "en",
    is_active: (profile?.is_active as boolean) ?? true,
    created_at: (profile?.created_at as string) ?? authUser.created_at ?? new Date().toISOString(),
  };

  return (
    <>
      <AuthInitializer user={user} />
      <AppLayout>{children}</AppLayout>
    </>
  );
}
