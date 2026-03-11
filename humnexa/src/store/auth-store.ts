"use client";

import { create } from "zustand";
import type { User } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  fetchUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      const mergedUser: User = {
        id: authUser.id,
        email: authUser.email ?? "",
        full_name:
          (profile?.full_name as string | null) ??
          (authUser.user_metadata?.full_name as string | null) ??
          null,
        phone:
          (profile?.phone as string | null) ??
          (authUser.phone as string | null) ??
          null,
        avatar_url:
          (profile?.avatar_url as string | null) ??
          (authUser.user_metadata?.avatar_url as string | null) ??
          null,
        role: (profile?.role as User["role"]) ?? "user",
        plan: (profile?.plan as User["plan"]) ?? "free",
        plan_expires_at: (profile?.plan_expires_at as string | null) ?? null,
        language: (profile?.language as string) ?? "en",
        is_active: (profile?.is_active as boolean) ?? true,
        created_at:
          (profile?.created_at as string | undefined) ??
          authUser.created_at ??
          new Date().toISOString(),
      };

      set({
        user: mergedUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false, user: null, isAuthenticated: false });
    }
  },

  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
    window.location.href = "/";
  },
}));
