"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("overflow-x-auto border-b border-brand-border-light dark:border-brand-border-dark", className)}>
      <div className="flex min-w-max items-center gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative flex items-center gap-2 px-1 py-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40",
                isActive
                  ? "font-semibold text-brand-primary"
                  : "text-brand-text-secondary hover:text-brand-text-light dark:hover:text-brand-text-dark",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
              <span>{tab.label}</span>
              {typeof tab.count === "number" ? (
                <span className="rounded-full bg-brand-card-light px-1.5 py-0.5 text-xs dark:bg-brand-card-dark">{tab.count}</span>
              ) : null}
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 h-0.5 origin-left rounded-full bg-brand-primary transition-transform duration-200",
                  isActive ? "scale-x-100" : "scale-x-0",
                )}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
