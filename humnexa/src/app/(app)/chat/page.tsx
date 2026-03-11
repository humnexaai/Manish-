"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatArea } from "@/components/chat/ChatArea";
import { ChatInput } from "@/components/chat/ChatInput";
import type { Message } from "@/types";

export default function ChatHomePage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ChatArea
        messages={messages}
        selectedModule="chat"
        onStarterClick={(prompt) => {
          const firstMessage: Message = {
            id: crypto.randomUUID(),
            conversation_id: "temp",
            role: "user",
            content: prompt,
            mode: "auto",
            model: "default",
            tokens_in: 0,
            tokens_out: 0,
            attachments: [],
            citations: [],
            created_at: new Date().toISOString(),
          };
          setMessages([firstMessage]);
        }}
      />
      <ChatInput
        onSend={(content) => {
          const conversationId = crypto.randomUUID();
          const firstMessage: Message = {
            id: crypto.randomUUID(),
            conversation_id: conversationId,
            role: "user",
            content,
            mode: "auto",
            model: "default",
            tokens_in: 0,
            tokens_out: 0,
            attachments: [],
            citations: [],
            created_at: new Date().toISOString(),
          };
          setMessages([firstMessage]);
          router.push(`/chat/${conversationId}`);
        }}
      />
    </div>
  );
}
