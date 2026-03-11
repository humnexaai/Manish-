"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  moduleName?: string;
}

export function AppLayout({ children, title, moduleName }: AppLayoutProps) {
  const { isMobile, setIsMobile, toggleSidebar, sidebarOpen, canvasOpen } = useUIStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileSidebarOpen(false);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [setIsMobile]);

  return (
    <div className="flex h-screen bg-brand-bg-light text-brand-text-light dark:bg-brand-bg-dark dark:text-brand-text-dark">
      {(!isMobile || mobileSidebarOpen) && (
        <Sidebar mobileOpen={mobileSidebarOpen} onCloseMobile={() => setMobileSidebarOpen(false)} onNewChat={() => setMobileSidebarOpen(false)} />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          title={title}
          moduleName={moduleName}
          onToggleSidebar={() => {
            if (isMobile) setMobileSidebarOpen((prev) => !prev);
            else toggleSidebar();
          }}
        />
        <main className={cn("flex min-h-0 flex-1 overflow-hidden", !sidebarOpen && !isMobile && "pl-0")}>
          <section className="min-w-0 flex-1 overflow-y-auto">{children}</section>
          {canvasOpen ? (
            <aside className="hidden w-[400px] shrink-0 border-l border-brand-border-light bg-brand-card-light p-4 dark:border-brand-border-dark dark:bg-brand-card-dark lg:block">
              <h3 className="text-sm font-semibold">Canvas</h3>
              <p className="mt-1 text-sm text-brand-text-secondary">Notes, drafts, and extracted context will appear here.</p>
            </aside>
          ) : null}
        </main>
      </div>
    </div>
  );
}
