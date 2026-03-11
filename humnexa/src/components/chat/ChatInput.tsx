"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowUp, Globe, Mic, Paperclip, Square } from "lucide-react";
import { useTheme } from "next-themes";
import { AI_MODES } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { useChatStore } from "@/store/chat-store";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend?: (message: string, options: { modeId: string; webSearch: boolean; files: File[] }) => void;
  onStop?: () => void;
  isStreaming?: boolean;
}

export function ChatInput({ onSend, onStop, isStreaming = false }: ChatInputProps) {
  const { selectedMode, setSelectedMode } = useChatStore();
  const { resolvedTheme } = useTheme();
  const [message, setMessage] = useState("");
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

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

  const submit = () => {
    const trimmed = message.trim();
    if (!trimmed || isStreaming) return;
    onSend?.(trimmed, { modeId: selectedMode.id, webSearch: webSearchEnabled, files: attachments });
    setMessage("");
    setAttachments([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

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
                submit();
              }
            }}
            rows={1}
            placeholder={resolvedTheme === "dark" ? "Humnexa se kuch bhi pucho..." : "Ask Humnexa anything..."}
            className="max-h-48 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-brand-text-secondary"
            aria-label="Chat message input"
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
              onClick={onStop}
              aria-label="Stop generation"
            >
              Stop
            </Button>
          ) : (
            <button
              type="button"
              onClick={submit}
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
