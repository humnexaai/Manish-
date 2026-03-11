"use client";

import { useState } from "react";
import { Bell, Menu, Moon, Share2, Sun, StickyNote } from "lucide-react";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/Badge";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title?: string;
  moduleName?: string;
  onToggleSidebar: () => void;
}

export function TopBar({ title = "New Chat", moduleName = "Chat", onToggleSidebar }: TopBarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const { toggleCanvas, isMobile } = useUIStore();
  const [editableTitle, setEditableTitle] = useState(title);
  const [editing, setEditing] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-brand-border-light bg-white/90 px-3 backdrop-blur dark:border-brand-border-dark dark:bg-brand-bg-dark/90">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-md p-2 text-brand-text-secondary hover:bg-brand-card-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:hover:bg-brand-card-dark"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>
        {editing ? (
          <input
            value={editableTitle}
            onChange={(event) => setEditableTitle(event.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(event) => {
              if (event.key === "Enter") setEditing(false);
            }}
            autoFocus
            className="w-56 rounded-md border border-brand-border-light bg-white px-2 py-1 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:border-brand-border-dark dark:bg-brand-card-dark"
          />
        ) : (
          <button
            type="button"
            className="truncate text-left text-sm font-semibold text-brand-text-light dark:text-brand-text-dark"
            onClick={() => setEditing(true)}
            aria-label="Edit conversation title"
          >
            {editableTitle}
          </button>
        )}
        {!isMobile ? <Badge text={moduleName} variant="outline" /> : null}
      </div>

      <div className={cn("flex items-center gap-1", isMobile && "gap-0.5")}>
        <button
          type="button"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="rounded-md p-2 text-brand-text-secondary hover:bg-brand-card-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:hover:bg-brand-card-dark"
          aria-label="Toggle theme"
        >
          {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        {!isMobile ? (
          <>
            <button
              type="button"
              className="relative rounded-md p-2 text-brand-text-secondary hover:bg-brand-card-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:hover:bg-brand-card-dark"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={toggleCanvas}
              className="rounded-md p-2 text-brand-text-secondary hover:bg-brand-card-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:hover:bg-brand-card-dark"
              aria-label="Toggle canvas"
            >
              <StickyNote className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-md p-2 text-brand-text-secondary hover:bg-brand-card-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:hover:bg-brand-card-dark"
              aria-label="Share conversation"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </>
        ) : null}
      </div>
    </header>
  );
}
