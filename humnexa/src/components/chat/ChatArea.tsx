"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { ArrowDown } from "lucide-react";
import type { Message } from "@/types";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface ChatAreaProps {
  messages: Message[];
  isTyping?: boolean;
  streamingText?: string;
  currentConversationId?: string | null;
  selectedModule?: string;
  onStarterClick?: (prompt: string) => void;
  onRegenerate?: (message: Message) => void;
}

const starterPromptsByModule: Record<string, string[]> = {
  chat: [
    "Summarize today's top India news in simple Hindi-English.",
    "Write a polite email asking for internship feedback.",
    "Explain UPI transaction flow for beginners.",
    "Create a weekly routine for exam preparation.",
  ],
  code: [
    "Build a debounced search input in React + TypeScript.",
    "Explain async/await with practical examples.",
    "Find bugs in this API handler and suggest fixes.",
    "Generate a clean folder structure for Next.js SaaS app.",
  ],
  learn: [
    "Teach me Indian Constitution fundamentals in easy steps.",
    "Explain photosynthesis in both Hindi and English.",
    "Create 10 MCQs for class 10 science chapter.",
    "Help me prepare a 7-day revision plan.",
  ],
};

function isSameDay(a: string, b: string) {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

export function ChatArea({
  messages,
  isTyping = false,
  streamingText = "",
  currentConversationId = null,
  selectedModule = "chat",
  onStarterClick,
  onRegenerate,
}: ChatAreaProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping, streamingText]);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    const handler = () => {
      const nearBottom = node.scrollHeight - node.scrollTop - node.clientHeight < 200;
      setShowScrollButton(!nearBottom);
    };
    node.addEventListener("scroll", handler);
    return () => node.removeEventListener("scroll", handler);
  }, []);

  const prompts = useMemo(
    () => starterPromptsByModule[selectedModule] ?? starterPromptsByModule.chat,
    [selectedModule],
  );

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      {messages.length === 0 && !currentConversationId ? (
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-10 text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl gradient-brand text-3xl font-bold text-white">
            H
          </div>
          <h2 className="text-xl font-semibold text-brand-text-light dark:text-brand-text-dark">How can I help you today?</h2>
          <p className="mt-1 text-sm text-brand-text-secondary">Aap Hindi ya English me puch sakte hain.</p>
          <div className="mt-6 grid w-full gap-3 sm:grid-cols-2">
            {prompts.slice(0, 4).map((prompt) => (
              <Card
                key={prompt}
                hover
                className="text-left"
                onClick={() => onStarterClick?.(prompt)}
                header={<p className="text-sm font-semibold">Starter Prompt</p>}
              >
                <p className="text-sm text-brand-text-secondary">{prompt}</p>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mx-auto flex w-full max-w-[760px] flex-col gap-4">
            {messages.map((message, index) => {
              const showDate = index === 0 || !isSameDay(messages[index - 1].created_at, message.created_at);
              return (
                <div key={message.id}>
                  {showDate ? (
                    <div className="my-2 text-center text-xs text-brand-text-secondary">
                      <span className="rounded-full bg-brand-card-light px-3 py-1 dark:bg-brand-card-dark">
                        {format(new Date(message.created_at), "dd MMM yyyy")}
                      </span>
                    </div>
                  ) : null}
                  <MessageBubble
                    message={message}
                    onRegenerate={() => onRegenerate?.(message)}
                  />
                </div>
              );
            })}
            {isTyping && !streamingText ? (
              <div className="flex items-center gap-2 px-2 text-sm text-brand-text-secondary">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand-primary [animation-delay:-0.2s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand-primary [animation-delay:-0.1s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand-primary" />
                </div>
                <span>Humnexa is thinking...</span>
              </div>
            ) : null}
            {streamingText ? (
              <MessageBubble
                isStreaming
                message={{
                  id: "streaming",
                  conversation_id: currentConversationId ?? "streaming",
                  role: "assistant",
                  content: streamingText,
                  mode: "auto",
                  model: "stream",
                  tokens_in: 0,
                  tokens_out: 0,
                  attachments: [],
                  citations: [],
                  created_at: new Date().toISOString(),
                }}
              />
            ) : null}
            <div ref={bottomRef} />
          </div>
        </div>
      )}

      {showScrollButton && messages.length > 0 ? (
        <button
          type="button"
          onClick={() => {
            if (listRef.current) listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
          }}
          className={cn(
            "absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-border-light bg-white text-brand-text-secondary shadow-md transition hover:bg-brand-card-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:border-brand-border-dark dark:bg-brand-card-dark dark:hover:bg-brand-bg-dark",
          )}
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
