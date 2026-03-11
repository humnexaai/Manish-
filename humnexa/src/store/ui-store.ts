"use client";

import { create } from "zustand";

type ThemeMode = "light" | "dark" | "system";

interface UIState {
  sidebarOpen: boolean;
  sidebarWidth: number;
  canvasOpen: boolean;
  isMobile: boolean;
  theme: ThemeMode;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleCanvas: () => void;
  setIsMobile: (isMobile: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  sidebarWidth: 280,
  canvasOpen: false,
  isMobile: false,
  theme: "system",

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleCanvas: () => set((state) => ({ canvasOpen: !state.canvasOpen })),
  setIsMobile: (isMobile) => set({ isMobile }),
  setTheme: (theme) => set({ theme }),
}));
