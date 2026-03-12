"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp, Globe, Mic, Paperclip, Square } from "lucide-react";
import { useTheme } from "next-themes";
import { AI_MODES } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { useChatStore } from "@/store/chat-store";
import { useAuthStore } from "@/store/auth-store";
import { showToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import type { Message } from "@/types";

interface ChatInputProps {
  conversationId?: string | null;
  initialMessage?: string | null;
  onInitialMessageConsumed?: () => void;
}

export function ChatInput({ conversationId = null, initialMessage, onInitialMessageConsumed }: ChatInputProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const {
    currentConversationId,
    selectedMode,
    selectedModule,
    isStreaming,
    setSelectedMode,
    setCurrentConversationId,
    addMessage,
    updateStreamingText,
    setIsStreaming,
    fetchConversations,
  } = useChatStore();
  const { resolvedTheme } = useTheme();
  const [message, setMessage] = useState("");
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const activeConversationId = conversationId ?? currentConversationId;

  const displayModes = useMemo(
    () => AI_MODES.filter((mode) => ["auto", "instant", "think-quick", "research", "code", "learn"].includes(mode.id)),
    [],
  );

  const thinkModes = AI_MODES.filter((mode) => mode.id.startsWith("think-"));

  const resizeTextarea = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    const maxHeight = 8 * 24;
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`;
  };

  const stopStreaming = () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = null;
    setIsStreaming(false);
    updateStreamingText("");
    showToast({ variant: "warning", message: "Generation stopped." });
  };

  const sendMessage = async (rawMessage: string) => {
    const trimmed = rawMessage.trim();
    if (!trimmed || isStreaming) return;
    if (!user) {
      showToast({ variant: "error", message: "Please login to send messages." });
      return;
    }

    const optimisticMessage: Message = {
      id: crypto.randomUUID(),
      conversation_id: activeConversationId ?? "new",
      role: "user",
      content: trimmed,
      mode: selectedMode.id,
      model: "default",
      tokens_in: 0,
      tokens_out: 0,
      attachments: [],
      citations: [],
      created_at: new Date().toISOString(),
    };
    addMessage(optimisticMessage);
    setIsStreaming(true);
    updateStreamingText("");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          conversation_id: activeConversationId,
          mode: selectedMode.id,
          module: selectedModule.id,
          web_search: webSearchEnabled,
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error || "Failed to stream response.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";
      let buffer = "";
      let newConversationId = activeConversationId;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine.startsWith("data: ")) continue;
          const payload = trimmedLine.slice(6).trim();
          if (!payload) continue;

          try {
            const data = JSON.parse(payload) as {
              type: "conversation_id" | "content" | "done" | "error";
              conversation_id?: string;
              content?: string;
              error?: string;
            };

            if (data.type === "conversation_id" && data.conversation_id) {
              newConversationId = data.conversation_id;
              setCurrentConversationId(newConversationId);
              if (!conversationId && pathname === "/chat") {
                window.history.replaceState(null, "", `/chat/${newConversationId}`);
              }
            } else if (data.type === "content" && data.content) {
              aiResponse += data.content;
              updateStreamingText(aiResponse);
            } else if (data.type === "error") {
              throw new Error(data.error || "AI request failed.");
            } else if (data.type === "done") {
              // ignored here; finalize after loop.
            }
          } catch {
            // ignore malformed chunk
          }
        }
      }

      if (aiResponse.trim()) {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          conversation_id: newConversationId ?? activeConversationId ?? "new",
          role: "assistant",
          content: aiResponse,
          mode: selectedMode.id,
          model: "default",
          tokens_in: 0,
          tokens_out: 0,
          attachments: [],
          citations: [],
          created_at: new Date().toISOString(),
        };
        addMessage(assistantMessage);
      }

      await fetchConversations();
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      showToast({
        variant: "error",
        message: error instanceof Error ? error.message : "Failed to send message.",
      });
    } finally {
      setIsStreaming(false);
      updateStreamingText("");
      abortRef.current = null;
    }
  };

  const submit = async () => {
    const trimmed = message.trim();
    if (!trimmed || isStreaming) return;
    await sendMessage(trimmed);
    setMessage("");
    setAttachments([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  useEffect(() => {
    if (!initialMessage?.trim() || isStreaming) return;
    void sendMessage(initialMessage);
    onInitialMessageConsumed?.();
  }, [initialMessage, isStreaming]);

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return (
    <div className="border-t border-brand-border-light bg-white px-3 py-3 dark:border-brand-border-dark dark:bg-brand-bg-dark">
      <div className="mb-2 flex gap-2 overflow-x-auto">
        {displayModes.map((mode) => {
          const isActive = selectedMode.id === mode.id || (mode.id === "think-quick" && selectedMode.id.startsWith("think-"));
          const isThinkPill = mode.id === "think-quick";
          const pill = (
            <button
              type="button"
              key={mode.id}
              onClick={() => setSelectedMode(mode)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40",
                isActive
                  ? "border-transparent text-white"
                  : "border-brand-border-light text-brand-text-secondary hover:text-brand-text-light dark:border-brand-border-dark dark:hover:text-brand-text-dark",
              )}
              style={isActive ? { backgroundColor: mode.color } : undefined}
              aria-label={`Select ${mode.name} mode`}
            >
              {mode.name}
            </button>
          );
          if (!isThinkPill) return pill;
          return (
            <Dropdown
              key={mode.id}
              trigger={pill}
              align="left"
              items={thinkModes.map((thinkMode) => ({
                label: thinkMode.name.replace("Think ", ""),
                onClick: () => setSelectedMode(thinkMode),
              }))}
            />
          );
        })}
      </div>

      <div className="rounded-2xl border border-brand-border-light bg-brand-card-light p-2 dark:border-brand-border-dark dark:bg-brand-card-dark">
        <div className="flex items-end gap-2">
          <Dropdown
            align="left"
            trigger={
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-brand-text-secondary hover:bg-brand-border-light/60 dark:hover:bg-brand-border-dark/60">
                <Paperclip className="h-4 w-4" />
              </span>
            }
            items={[
              { label: "Upload File", onClick: () => fileInputRef.current?.click() },
              { label: "Upload Image", onClick: () => imageInputRef.current?.click() },
              { label: "Take Photo", onClick: () => imageInputRef.current?.click() },
            ]}
          />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(event) => {
              if (event.target.files?.length) setAttachments(Array.from(event.target.files));
            }}
          />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(event) => {
              if (event.target.files?.length) setAttachments(Array.from(event.target.files));
            }}
          />

          <textarea
            ref={textareaRef}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              resizeTextarea();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void submit();
              }
            }}
            rows={1}
            placeholder={resolvedTheme === "dark" ? "Humnexa se kuch bhi pucho..." : "Ask Humnexa anything..."}
            className="max-h-48 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-brand-text-secondary disabled:cursor-not-allowed disabled:opacity-70"
            aria-label="Chat message input"
            disabled={isStreaming}
          />

          <button
            type="button"
            onClick={() => setWebSearchEnabled((prev) => !prev)}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40",
              webSearchEnabled ? "bg-brand-primary text-white" : "text-brand-text-secondary hover:bg-brand-border-light/60 dark:hover:bg-brand-border-dark/60",
            )}
            aria-label="Toggle web search"
            aria-pressed={webSearchEnabled}
          >
            <Globe className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-brand-text-secondary transition hover:bg-brand-border-light/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:hover:bg-brand-border-dark/60"
            aria-label="Voice input"
          >
            <Mic className="h-4 w-4" />
          </button>
          {isStreaming ? (
            <Button
              variant="danger"
              className="h-9 rounded-full px-3"
              leftIcon={<Square className="h-4 w-4" />}
              onClick={stopStreaming}
              aria-label="Stop generation"
            >
              Stop
            </Button>
          ) : (
            <button
              type="button"
              onClick={() => void submit()}
              disabled={!message.trim()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full gradient-brand text-white transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send message"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          )}
        </div>
        {attachments.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {attachments.map((file) => (
              <span key={`${file.name}-${file.size}`} className="rounded-full bg-brand-primary/10 px-2 py-1 text-xs text-brand-primary">
                {file.name}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <p className="mt-2 text-xs text-brand-text-secondary">
        Humnexa can make mistakes. Please verify important information.
      </p>
    </div>
  );
}
