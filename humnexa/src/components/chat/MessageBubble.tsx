"use client";

import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { Check, Copy, RefreshCw, ThumbsDown, ThumbsUp } from "lucide-react";
import type { Message } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { showToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "@/lib/utils/markdown";
import { copyToClipboard } from "@/lib/utils/index";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  onRegenerate?: () => void;
}

export function MessageBubble({ message, isStreaming = false, onRegenerate }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const modeLabel = useMemo(() => message.mode.replace(/[-_]/g, " ").replace(/\b\w/g, (v) => v.toUpperCase()), [message.mode]);
  const timestamp = useMemo(
    () =>
      formatDistanceToNow(new Date(message.created_at || new Date().toISOString()), {
        addSuffix: true,
      }),
    [message.created_at],
  );

  return (
    <div className={cn("group flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser ? <Avatar name="Humnexa" size="sm" /> : null}
      <div className={cn("max-w-[85%] rounded-2xl px-4 py-3", isUser ? "bg-brand-primary/10" : "bg-brand-card-light dark:bg-brand-card-dark")}>
        <div className="mb-2 flex items-center gap-2 text-xs text-brand-text-secondary">
          <span className="font-medium text-brand-text-light dark:text-brand-text-dark">{isUser ? "User" : "Humnexa"}</span>
          {!isUser ? <Badge text={modeLabel} variant="outline" /> : null}
          <span>{timestamp}</span>
        </div>

        <MarkdownRenderer content={message.content + (isStreaming ? "|" : "")} />

        {!isUser ? (
          <div className="mt-2 flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
            <button
              type="button"
              onClick={async () => {
                const copied = await copyToClipboard(message.content);
                showToast({ variant: copied ? "success" : "error", message: copied ? "Copied!" : "Copy failed" });
              }}
              className="rounded p-1.5 text-brand-text-secondary hover:bg-brand-border-light/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:hover:bg-brand-border-dark/60"
              aria-label="Copy message"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onRegenerate}
              className="rounded p-1.5 text-brand-text-secondary hover:bg-brand-border-light/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:hover:bg-brand-border-dark/60"
              aria-label="Regenerate response"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="rounded p-1.5 text-brand-text-secondary hover:bg-brand-border-light/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:hover:bg-brand-border-dark/60"
              aria-label="Thumbs up"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="rounded p-1.5 text-brand-text-secondary hover:bg-brand-border-light/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:hover:bg-brand-border-dark/60"
              aria-label="Thumbs down"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
            {isStreaming ? <span className="animate-pulse text-brand-text-secondary">|</span> : <Check className="h-3 w-3 text-success" />}
          </div>
        ) : null}
      </div>
      {isUser ? <Avatar name="You" size="sm" /> : null}
    </div>
  );
}
