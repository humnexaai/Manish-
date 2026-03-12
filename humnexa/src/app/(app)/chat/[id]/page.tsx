"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChatArea } from "@/components/chat/ChatArea";
import { ChatInput } from "@/components/chat/ChatInput";
import type { Conversation, Message } from "@/types";
import { useChatStore } from "@/store/chat-store";

export default function ConversationPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [regeneratePrompt, setRegeneratePrompt] = useState<string | null>(null);
  const {
    currentConversation,
    messages,
    isStreaming,
    streamingText,
    setCurrentConversation,
    setCurrentConversationId,
    setMessages,
  } = useChatStore();

  useEffect(() => {
    let cancelled = false;
    const fetchConversation = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/chat/${id}`, { cache: "no-store" });
        if (response.status === 404) {
          router.replace("/chat");
          return;
        }
        if (!response.ok) throw new Error("Failed to load conversation.");
        const payload = (await response.json()) as { conversation: Conversation; messages: Message[] };
        if (cancelled) return;
        setCurrentConversation(payload.conversation);
        setCurrentConversationId(payload.conversation.id);
        setMessages(payload.messages ?? []);
      } catch {
        if (!cancelled) {
          setCurrentConversation(null);
          setCurrentConversationId(id);
          setMessages([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void fetchConversation();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const chatTitle = useMemo(() => currentConversation?.title || "Conversation", [currentConversation?.title]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="px-4 py-2 text-sm font-medium text-brand-text-secondary">{chatTitle}</div>
      {isLoading ? (
        <div className="flex-1 p-4">
          <div className="h-20 animate-pulse rounded-xl bg-brand-card-light dark:bg-brand-card-dark" />
        </div>
      ) : (
        <ChatArea
          messages={messages}
          isTyping={isStreaming}
          streamingText={streamingText}
          currentConversationId={id}
          onRegenerate={(assistantMessage) => {
            const index = messages.findIndex((item) => item.id === assistantMessage.id);
            if (index <= 0) return;
            const previousUser = [...messages.slice(0, index)].reverse().find((item) => item.role === "user");
            if (previousUser?.content) setRegeneratePrompt(previousUser.content);
          }}
        />
      )}
      <ChatInput
        conversationId={id}
        initialMessage={regeneratePrompt}
        onInitialMessageConsumed={() => {
          setRegeneratePrompt(null);
        }}
      />
    </div>
  );
}
