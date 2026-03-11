"use client";

import { useRouter } from "next/navigation";
import { ChatArea } from "@/components/chat/ChatArea";
import { ChatInput } from "@/components/chat/ChatInput";

export default function ChatHomePage() {
  const router = useRouter();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ChatArea
        messages={[]}
        selectedModule="chat"
        onStarterClick={(prompt) => {
          const conversationId = crypto.randomUUID();
          const query = new URLSearchParams({
            q: prompt,
            mode: "auto",
            web: "0",
          }).toString();
          router.push(`/chat/${conversationId}?${query}`);
        }}
      />
      <ChatInput
        onSend={(content, options) => {
          const conversationId = crypto.randomUUID();
          const query = new URLSearchParams({
            q: content,
            mode: options.modeId,
            web: options.webSearch ? "1" : "0",
          }).toString();
          router.push(`/chat/${conversationId}?${query}`);
        }}
      />
    </div>
  );
}
