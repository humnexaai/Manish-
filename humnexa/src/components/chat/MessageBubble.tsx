"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Check, Copy, Pencil, RefreshCw, ThumbsDown, ThumbsUp } from "lucide-react";
import type { Message } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { Tooltip } from "@/components/ui/Tooltip";
import { showToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  onRegenerate?: () => void;
}

function MarkdownCodeBlock({ className, children }: { className?: string; children: ReactNode }) {
  const text = String(children).replace(/\n$/, "");
  const language = className?.replace("language-", "") || "text";

  const lines = text.split("\n");

  return (
    <div className="my-3 overflow-hidden rounded-lg border border-brand-border-light dark:border-brand-border-dark">
      <div className="flex items-center justify-between bg-brand-card-light px-3 py-2 dark:bg-brand-card-dark">
        <span className="text-xs font-medium text-brand-text-secondary">{language}</span>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(text);
            showToast({ variant: "success", message: "Copied!" });
          }}
          className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-brand-text-secondary hover:bg-brand-border-light/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:hover:bg-brand-border-dark/60"
          aria-label="Copy code block"
        >
          <Copy className="h-3.5 w-3.5" />
          Copy
        </button>
      </div>
      <pre className="overflow-x-auto bg-brand-bg-dark p-3 text-xs text-brand-text-dark">
        {lines.map((line, index) => (
          <div key={index} className="table-row">
            <span className="table-cell select-none pr-3 text-right text-brand-text-secondary">{index + 1}</span>
            <code className={cn("table-cell", className)}>{line}</code>
          </div>
        ))}
      </pre>
    </div>
  );
}

export function MessageBubble({ message, isStreaming = false, onRegenerate }: MessageBubbleProps) {
  const isUser = message.role === "user";
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
          <span>{timestamp}</span>
        </div>

        <div className="prose prose-sm max-w-none break-words dark:prose-invert prose-headings:text-brand-text-light dark:prose-headings:text-brand-text-dark prose-a:text-brand-primary">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              code(props) {
                const { className, children, ...rest } = props;
                const inline = !className;
                if (inline) {
                  return (
                    <code className="rounded bg-brand-card-light px-1 py-0.5 text-xs dark:bg-brand-card-dark" {...rest}>
                      {children}
                    </code>
                  );
                }
                return <MarkdownCodeBlock className={className} children={children} />;
              },
              a(props) {
                return <a {...props} className="text-brand-primary underline-offset-2 hover:underline" target="_blank" rel="noreferrer" />;
              },
            }}
          >
            {message.content + (isStreaming ? "|" : "")}
          </ReactMarkdown>
        </div>

        {!isUser ? (
          <div className="mt-2 flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(message.content);
                showToast({ variant: "success", message: "Copied!" });
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
            <Tooltip content="Coming Soon">
              <button
                type="button"
                className="rounded p-1.5 text-brand-text-secondary hover:bg-brand-border-light/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:hover:bg-brand-border-dark/60"
                aria-label="Edit message"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </Tooltip>
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
