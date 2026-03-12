"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MoreHorizontal, PanelLeftClose, PanelLeftOpen, Pin, Plus, Settings } from "lucide-react";
import { MODULES } from "@/lib/constants";
import { iconMap } from "@/lib/icon-map";
import { useAuthStore } from "@/store/auth-store";
import { useChatStore } from "@/store/chat-store";
import { useUIStore } from "@/store/ui-store";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";
import { groupConversationsByDate, formatRelativeTime } from "@/lib/utils/index";
import type { Conversation } from "@/types";
import { showToast } from "@/components/ui/Toast";

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  onNewChat?: () => void;
}

export function Sidebar({ mobileOpen = false, onCloseMobile, onNewChat }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen, sidebarWidth, toggleSidebar, isMobile } = useUIStore();
  const { user } = useAuthStore();
  const {
    conversations,
    fetchConversations,
    setCurrentConversationId,
    removeConversation,
    upsertConversation,
    isFetchingConversations,
  } = useChatStore();
  const [search, setSearch] = useState("");
  const [activeModule, setActiveModule] = useState("chat");
  const [menuConversation, setMenuConversation] = useState<string | null>(null);
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "b") {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleSidebar]);

  useEffect(() => {
    const closeContext = () => setMenuConversation(null);
    window.addEventListener("click", closeContext);
    return () => window.removeEventListener("click", closeContext);
  }, []);

  useEffect(() => {
    void fetchConversations();
  }, [pathname]);

  const filteredConversations = useMemo(() => {
    return conversations
      .filter((item) => !item.deleted_at)
      .filter((item) => (activeModule ? item.module === activeModule : true))
      .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => Number(Boolean(b.is_pinned)) - Number(Boolean(a.is_pinned)));
  }, [activeModule, conversations, search]);

  const groups = groupConversationsByDate(filteredConversations);
  const visible = isMobile ? mobileOpen : true;

  const updateConversation = async (id: string, payload: Partial<Conversation>) => {
    const response = await fetch(`/api/chat/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(body.error || "Failed to update conversation.");
    }
    const body = (await response.json()) as { conversation: Conversation };
    upsertConversation(body.conversation);
  };

  const deleteConversation = async (id: string) => {
    const confirmed = window.confirm("Delete this conversation?");
    if (!confirmed) return;
    const response = await fetch(`/api/chat/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete conversation.");
    removeConversation(id);
  };

  const sidebarBody = (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? sidebarWidth : 64 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="flex h-full shrink-0 flex-col border-r border-brand-border-light bg-white dark:border-brand-border-dark dark:bg-brand-bg-dark"
      onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)}
      onTouchEnd={(event) => {
        if (!isMobile || touchStartX === null) return;
        const touchEnd = event.changedTouches[0]?.clientX ?? touchStartX;
        if (touchStartX - touchEnd > 60) onCloseMobile?.();
      }}
    >
      <div className="border-b border-brand-border-light p-3 dark:border-brand-border-dark">
        <div className="flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-primary font-bold text-white">
              H
            </div>
            {sidebarOpen ? (
              <div>
                <p className="text-sm font-semibold text-brand-text-light dark:text-brand-text-dark">Humnexa</p>
                <p className="text-xs text-brand-text-secondary">Bolo Aur Ho Jaye</p>
              </div>
            ) : null}
          </Link>
          {!isMobile ? (
            <button
              type="button"
              onClick={toggleSidebar}
              className="rounded-md p-1 text-brand-text-secondary hover:bg-brand-card-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:hover:bg-brand-card-dark"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            </button>
          ) : null}
        </div>
        <Button
          className={cn("mt-3", !sidebarOpen && "justify-center px-0")}
          fullWidth={sidebarOpen}
          leftIcon={<Plus className="h-4 w-4" />}
          aria-label="Create new chat"
          onClick={() => {
            onNewChat?.();
            router.push("/chat");
          }}
        >
          {sidebarOpen ? "New Chat" : ""}
        </Button>
      </div>

      <div className="px-3 py-2">{sidebarOpen ? <SearchInput placeholder="Search conversations" onChange={setSearch} /> : null}</div>

      <div className="border-b border-brand-border-light px-2 pb-2 dark:border-brand-border-dark">
        <div className="flex gap-1 overflow-x-auto">
          {MODULES.map((module) => {
            const Icon = iconMap[module.icon];
            const active = module.id === activeModule;
            const content = (
              <button
                key={module.id}
                type="button"
                onClick={() => {
                  setActiveModule(module.id);
                  if (module.phase === 1) router.push(module.route);
                }}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40",
                  active
                    ? "bg-brand-primary text-white"
                    : "text-brand-text-secondary hover:bg-brand-card-light hover:text-brand-text-light dark:hover:bg-brand-card-dark dark:hover:text-brand-text-dark",
                )}
                aria-label={module.name}
              >
                {Icon ? <Icon className="h-4 w-4" /> : null}
                {sidebarOpen ? module.name : null}
              </button>
            );

            return module.phase === 2 ? (
              <Tooltip key={module.id} content="Coming Soon">
                {content}
              </Tooltip>
            ) : (
              content
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {!isFetchingConversations && filteredConversations.length === 0 ? (
          <p className="px-2 py-3 text-xs text-brand-text-secondary">
            {search ? "No matching conversations." : "No conversations yet. Start a new chat."}
          </p>
        ) : null}
        {Object.entries(groups).map(([label, items]) =>
          items.length ? (
            <div key={label} className="mb-3">
              {sidebarOpen ? <p className="px-2 py-1 text-xs font-medium text-brand-text-secondary">{label}</p> : null}
              <div className="space-y-1">
                {items.map((item) => {
                  const moduleIconName = MODULES.find((mod) => mod.id === item.module)?.icon ?? "MessageSquare";
                  const moduleRoute = MODULES.find((mod) => mod.id === item.module)?.route ?? "/chat";
                  const ModuleIcon = iconMap[moduleIconName];
                  const conversationHref = item.module === "chat" ? `/chat/${item.id}` : moduleRoute;
                  const isActiveConversation = pathname === conversationHref;
                  return (
                    <div key={item.id} className="group relative">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentConversationId(item.id);
                          router.push(conversationHref);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40",
                          isActiveConversation
                            ? "bg-brand-primary/10"
                            : "hover:bg-brand-card-light dark:hover:bg-brand-card-dark",
                        )}
                      >
                        {ModuleIcon ? <ModuleIcon className="h-4 w-4 shrink-0 text-brand-text-secondary" /> : null}
                        {sidebarOpen ? (
                          <div className="min-w-0 flex-1">
                            {editingConversationId === item.id ? (
                              <input
                                value={editingTitle}
                                onChange={(event) => setEditingTitle(event.target.value)}
                                className="w-full rounded-md border border-brand-border-light bg-white px-2 py-1 text-sm text-brand-text-light outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:border-brand-border-dark dark:bg-brand-card-dark dark:text-brand-text-dark"
                                onKeyDown={async (event) => {
                                  if (event.key !== "Enter") return;
                                  const nextTitle = editingTitle.trim();
                                  setEditingConversationId(null);
                                  if (!nextTitle) return;
                                  try {
                                    await updateConversation(item.id, { title: nextTitle });
                                  } catch (error) {
                                    showToast({
                                      variant: "error",
                                      message: error instanceof Error ? error.message : "Rename failed.",
                                    });
                                  }
                                }}
                                onBlur={() => setEditingConversationId(null)}
                                autoFocus
                              />
                            ) : (
                              <>
                                <p className="truncate text-sm text-brand-text-light dark:text-brand-text-dark">{item.title}</p>
                                <div className="mt-0.5 flex items-center gap-1 text-xs text-brand-text-secondary">
                                  <span>{formatRelativeTime(item.last_message_at || item.created_at)}</span>
                                  {item.is_pinned ? <Pin className="h-3 w-3" /> : null}
                                </div>
                              </>
                            )}
                          </div>
                        ) : null}
                      </button>
                      {sidebarOpen ? (
                        <button
                          type="button"
                          className="absolute right-1 top-1/2 hidden -translate-y-1/2 rounded-md p-1 text-brand-text-secondary hover:bg-brand-border-light/60 group-hover:block focus-visible:block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:hover:bg-brand-border-dark/60"
                          onClick={() => setMenuConversation((prev) => (prev === item.id ? null : item.id))}
                          aria-label="Conversation options"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      ) : null}
                      {menuConversation === item.id ? (
                        <div className="absolute right-6 top-8 z-30 w-36 rounded-md border border-brand-border-light bg-white p-1 shadow-lg dark:border-brand-border-dark dark:bg-brand-card-dark">
                          {["Rename", item.is_pinned ? "Unpin" : "Pin", "Archive", "Delete"].map((action) => (
                            <button
                              key={action}
                              type="button"
                              onClick={async () => {
                                setMenuConversation(null);
                                try {
                                  if (action === "Rename") {
                                    setEditingConversationId(item.id);
                                    setEditingTitle(item.title);
                                  } else if (action === "Pin" || action === "Unpin") {
                                    await updateConversation(item.id, { is_pinned: !item.is_pinned });
                                  } else if (action === "Archive") {
                                    await updateConversation(item.id, { is_archived: !item.is_archived });
                                  } else if (action === "Delete") {
                                    await deleteConversation(item.id);
                                  }
                                } catch (error) {
                                  showToast({
                                    variant: "error",
                                    message: error instanceof Error ? error.message : "Action failed.",
                                  });
                                }
                              }}
                              className={cn(
                                "block w-full rounded px-2 py-1.5 text-left text-xs hover:bg-brand-card-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:hover:bg-brand-bg-dark",
                                action === "Delete" ? "text-error" : "text-brand-text-light dark:text-brand-text-dark",
                              )}
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null,
        )}
      </div>

      <div className="border-t border-brand-border-light p-3 dark:border-brand-border-dark">
        <div className={cn("flex items-center gap-2", !sidebarOpen && "justify-center")}>
          <Avatar size="sm" name={user?.full_name ?? "Humnexa User"} status="online" />
          {sidebarOpen ? (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-brand-text-light dark:text-brand-text-dark">
                {user?.full_name ?? user?.email ?? "Humnexa User"}
              </p>
              <Badge text={user?.plan ? user.plan.toUpperCase() : "FREE"} />
            </div>
          ) : null}
          {sidebarOpen ? (
            <Link
              href="/settings"
              className="rounded-md p-1 text-brand-text-secondary hover:bg-brand-card-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:hover:bg-brand-card-dark"
              aria-label="Open settings"
            >
              <Settings className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </div>
    </motion.aside>
  );

  return (
    <>
      {isMobile ? (
        <div className={cn("fixed inset-0 z-40", visible ? "pointer-events-auto" : "pointer-events-none")}>
          <div
            className={cn("absolute inset-0 bg-black/40 transition-opacity", visible ? "opacity-100" : "opacity-0")}
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className={cn("absolute inset-y-0 left-0 transition-transform", visible ? "translate-x-0" : "-translate-x-full")}>{sidebarBody}</div>
        </div>
      ) : (
        sidebarBody
      )}
    </>
  );
}
