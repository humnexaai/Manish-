"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ChatArea } from "@/components/chat/ChatArea";
import { ChatInput } from "@/components/chat/ChatInput";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/components/ui/Toast";
import type { Message } from "@/types";

interface ChatSendOptions {
  modeId: string;
  webSearch: boolean;
  files: File[];
}

function toMessage(row: Record<string, unknown>, conversationId: string): Message {
  return {
    id: (row.id as string | undefined) ?? crypto.randomUUID(),
    conversation_id: (row.conversation_id as string | undefined) ?? conversationId,
    role: (row.role as Message["role"] | undefined) ?? "assistant",
    content: (row.content as string | undefined) ?? "",
    mode: (row.mode as string | undefined) ?? "auto",
    model: (row.model as string | undefined) ?? "default",
    tokens_in: Number(row.tokens_in ?? 0),
    tokens_out: Number(row.tokens_out ?? 0),
    attachments: (row.attachments as Array<Record<string, unknown>> | undefined) ?? [],
    citations: (row.citations as Array<Record<string, unknown>> | undefined) ?? [],
    created_at: (row.created_at as string | undefined) ?? new Date().toISOString(),
  };
}

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationTitle, setConversationTitle] = useState("Conversation");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | undefined>();
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const streamedTextRef = useRef("");
  const activeAssistantRef = useRef<{ id: string; modeId: string } | null>(null);
  const conversationReadyRef = useRef(false);
  const autoPromptSentRef = useRef(false);

  const initialPrompt = searchParams.get("q")?.trim() ?? "";
  const initialMode = searchParams.get("mode")?.trim() || "auto";
  const initialWebSearch = searchParams.get("web") === "1";

  const persistMessage = async (message: Message) => {
    const supabase = createClient();
    const fullPayload = {
      id: message.id,
      conversation_id: message.conversation_id,
      role: message.role,
      content: message.content,
      mode: message.mode,
      model: message.model,
      tokens_in: message.tokens_in,
      tokens_out: message.tokens_out,
      attachments: message.attachments,
      citations: message.citations,
      created_at: message.created_at,
    };

    const { error } = await supabase.from("messages").insert(fullPayload);
    if (!error) return;

    // Fallback for leaner schemas where optional analytics fields may be absent.
    await supabase.from("messages").insert({
      id: message.id,
      conversation_id: message.conversation_id,
      role: message.role,
      content: message.content,
      created_at: message.created_at,
    });
  };

  const ensureConversationExists = async (firstUserContent: string, modeId: string) => {
    if (conversationReadyRef.current) return;
    const supabase = createClient();
    const { data: existingConversation } = await supabase
      .from("conversations")
      .select("id,title")
      .eq("id", id)
      .maybeSingle();

    if (existingConversation?.id) {
      conversationReadyRef.current = true;
      if (existingConversation.title) setConversationTitle(existingConversation.title as string);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const title = firstUserContent.slice(0, 80) || "New conversation";
    const now = new Date().toISOString();

    const { error } = await supabase.from("conversations").insert({
      id,
      user_id: user.id,
      title,
      module: "chat",
      model: modeId,
      is_pinned: false,
      is_archived: false,
      project_id: null,
      message_count: 0,
      last_message_at: now,
      created_at: now,
    });

    if (error) {
      await supabase.from("conversations").insert({
        id,
        user_id: user.id,
        title,
        module: "chat",
      });
    }

    conversationReadyRef.current = true;
    setConversationTitle(title);
  };

  const persistAssistantIfAny = async () => {
    if (!activeAssistantRef.current) return;
    const content = streamedTextRef.current.trim();
    if (!content) return;

    const assistantMessage: Message = {
      id: activeAssistantRef.current.id,
      conversation_id: id,
      role: "assistant",
      content,
      mode: activeAssistantRef.current.modeId,
      model: "default",
      tokens_in: 0,
      tokens_out: 0,
      attachments: [],
      citations: [],
      created_at: new Date().toISOString(),
    };

    await persistMessage(assistantMessage).catch(() => undefined);
  };

  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = null;
    if (streamRef.current) clearInterval(streamRef.current);
    streamRef.current = null;
    autoPromptSentRef.current = false;
    conversationReadyRef.current = false;
    activeAssistantRef.current = null;
    streamedTextRef.current = "";
    setMessages([]);
    setConversationTitle("Conversation");
    setIsTyping(false);
    setStreamingMessageId(undefined);

    const fetchConversationData = async () => {
      try {
        const supabase = createClient();
        const { data: conversation } = await supabase.from("conversations").select("title").eq("id", id).maybeSingle();
        if (conversation?.title) setConversationTitle(conversation.title as string);
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", id)
          .order("created_at", { ascending: true });
        if (error) throw error;
        if (data?.length) {
          conversationReadyRef.current = true;
          setMessages(data.map((row) => toMessage(row as Record<string, unknown>, id)));
        } else {
          setMessages([]);
        }
      } catch {
        setMessages([]);
      }
    };
    void fetchConversationData();
  }, [id]);

  const stopStream = async (persistPartial = false) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = null;
    if (streamRef.current) clearInterval(streamRef.current);
    streamRef.current = null;
    if (persistPartial) {
      await persistAssistantIfAny();
    }
    setIsTyping(false);
    setStreamingMessageId(undefined);
    activeAssistantRef.current = null;
    streamedTextRef.current = "";
  };

  const sendMessage = async (content: string, options: ChatSendOptions) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      conversation_id: id,
      role: "user",
      content,
      mode: options.modeId,
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
      mode: options.modeId,
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
    activeAssistantRef.current = { id: assistantId, modeId: options.modeId };
    streamedTextRef.current = "";

    await ensureConversationExists(content, options.modeId);
    await persistMessage(userMessage).catch(() => undefined);

    const history = [...messages, userMessage]
      .filter((message) => message.role === "user" || message.role === "assistant")
      .map((message) => ({ role: message.role, content: message.content }))
      .slice(-12);

    const controller = new AbortController();
    abortRef.current = controller;

    let fullText = "";
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modeId: options.modeId,
          webSearch: options.webSearch,
          messages: history,
        }),
        signal: controller.signal,
      });
      const payload = (await response.json()) as { reply?: string; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to generate response.");
      fullText = payload.reply?.trim() ?? "";
      if (!fullText) throw new Error("Received empty response from the assistant.");
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      fullText = `I ran into an issue generating this response. ${
        error instanceof Error ? error.message : "Please try again."
      }`;
      showToast({ variant: "error", message: "Generation failed. A fallback message was added." });
    }

    let index = 0;
    streamRef.current = setInterval(() => {
      index += 1;
      const partial = fullText.slice(0, index);
      streamedTextRef.current = partial;
      setMessages((prev) =>
        prev.map((msg) => (msg.id === assistantId ? { ...msg, content: partial } : msg)),
      );
      if (index >= fullText.length) {
        void persistAssistantIfAny();
        void stopStream();
      }
    }, 22);
  };

  useEffect(() => {
    if (!messages.length && initialPrompt && !autoPromptSentRef.current) {
      autoPromptSentRef.current = true;
      void sendMessage(initialPrompt, {
        modeId: initialMode,
        webSearch: initialWebSearch,
        files: [],
      });
    }
  }, [initialMode, initialPrompt, initialWebSearch, messages.length]);

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
      if (streamRef.current) clearInterval(streamRef.current);
    };
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="px-4 py-2 text-sm font-medium text-brand-text-secondary">{conversationTitle}</div>
      <ChatArea messages={messages} isTyping={isTyping} streamingMessageId={streamingMessageId} />
      <ChatInput
        isStreaming={isTyping}
        onStop={async () => {
          await stopStream(true);
          showToast({ variant: "warning", message: "Generation stopped." });
        }}
        onSend={(content, options) => {
          void sendMessage(content, options);
        }}
      />
    </div>
  );
}
