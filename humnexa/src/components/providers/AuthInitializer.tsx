"use client";

import { useEffect } from "react";
import type { User } from "@/types";
import { useAuthStore } from "@/store/auth-store";

export function AuthInitializer({ user }: { user: User }) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    setUser(user);
  }, [setUser, user]);

  return null;
}
