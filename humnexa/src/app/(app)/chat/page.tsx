"use client";

import { useEffect, useState } from "react";
import { ChatArea } from "@/components/chat/ChatArea";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChatStore } from "@/store/chat-store";

export default function ChatHomePage() {
  const {
    messages,
    isStreaming,
    streamingText,
    selectedModule,
    setMessages,
    setCurrentConversationId,
    setCurrentConversation,
  } = useChatStore();
  const [starterPrompt, setStarterPrompt] = useState<string | null>(null);

  useEffect(() => {
    setCurrentConversationId(null);
    setCurrentConversation(null);
    setMessages([]);
  }, [setCurrentConversation, setCurrentConversationId, setMessages]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ChatArea
        messages={messages}
        isTyping={isStreaming}
        streamingText={streamingText}
        currentConversationId={null}
        selectedModule={selectedModule.id}
        onStarterClick={(prompt) => {
          setStarterPrompt(prompt);
        }}
      />
      <ChatInput
        conversationId={null}
        initialMessage={starterPrompt}
        onInitialMessageConsumed={() => setStarterPrompt(null)}
      />
    </div>
  );
}
