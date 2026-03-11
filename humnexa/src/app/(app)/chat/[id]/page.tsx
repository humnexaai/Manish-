"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { ChatArea } from "@/components/chat/ChatArea";
import { ChatInput } from "@/components/chat/ChatInput";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/components/ui/Toast";
import type { Message } from "@/types";

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationTitle, setConversationTitle] = useState("Conversation");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | undefined>();
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchConversationData = async () => {
      try {
        const supabase = createClient();
        const { data: conversation } = await supabase.from("conversations").select("title").eq("id", id).single();
        if (conversation?.title) setConversationTitle(conversation.title as string);
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", id)
          .order("created_at", { ascending: true });
        if (error) throw error;
        if (data?.length) {
          setMessages(data as Message[]);
        } else {
          setMessages([]);
        }
      } catch {
        setMessages([]);
      }
    };
    fetchConversationData();
  }, [id]);

  const stopStream = () => {
    if (streamRef.current) clearInterval(streamRef.current);
    streamRef.current = null;
    setIsTyping(false);
    setStreamingMessageId(undefined);
  };

  const sendMessage = (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      conversation_id: id,
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
    const assistantId = crypto.randomUUID();
    const assistantMessage: Message = {
      id: assistantId,
      conversation_id: id,
      role: "assistant",
      content: "",
      mode: "auto",
      model: "default",
      tokens_in: 0,
      tokens_out: 0,
      attachments: [],
      citations: [],
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsTyping(true);
    setStreamingMessageId(assistantId);

    const fullText =
      "Yeh demo response hai. Step 2 me hum isse real AI streaming API se connect karenge. Aap Hindi ya English dono me type kar sakte hain.";
    let index = 0;
    streamRef.current = setInterval(() => {
      index += 1;
      setMessages((prev) =>
        prev.map((msg) => (msg.id === assistantId ? { ...msg, content: fullText.slice(0, index) } : msg)),
      );
      if (index >= fullText.length) {
        stopStream();
      }
    }, 22);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) clearInterval(streamRef.current);
    };
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="px-4 py-2 text-sm font-medium text-brand-text-secondary">{conversationTitle}</div>
      <ChatArea messages={messages} isTyping={isTyping} streamingMessageId={streamingMessageId} />
      <ChatInput
        isStreaming={isTyping}
        onStop={() => {
          stopStream();
          showToast({ variant: "warning", message: "Generation stopped." });
        }}
        onSend={(content) => sendMessage(content)}
      />
    </div>
  );
}
