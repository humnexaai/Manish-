"use client";

import { create } from "zustand";
import { AI_MODES, MODULES } from "@/lib/constants";
import type { AIMode, Conversation, Message, Module } from "@/types";

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  currentConversation: Conversation | null;
  messages: Message[];
  isStreaming: boolean;
  streamingText: string;
  selectedMode: AIMode;
  selectedModule: Module;
  isFetchingConversations: boolean;
  setConversations: (conversations: Conversation[]) => void;
  fetchConversations: (filters?: { module?: string; search?: string; limit?: number }) => Promise<void>;
  upsertConversation: (conversation: Conversation) => void;
  removeConversation: (conversationId: string) => void;
  setCurrentConversationId: (conversationId: string | null) => void;
  setCurrentConversation: (conversation: Conversation | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  updateStreamingText: (text: string) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  setSelectedMode: (mode: AIMode) => void;
  setSelectedModule: (module: Module) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  currentConversationId: null,
  currentConversation: null,
  messages: [],
  isStreaming: false,
  streamingText: "",
  selectedMode: AI_MODES[0],
  selectedModule: MODULES[0],
  isFetchingConversations: false,

  setConversations: (conversations) => set({ conversations }),
  fetchConversations: async (filters) => {
    set({ isFetchingConversations: true });
    try {
      const params = new URLSearchParams();
      if (filters?.module) params.set("module", filters.module);
      if (filters?.search) params.set("search", filters.search);
      if (filters?.limit) params.set("limit", String(filters.limit));

      const response = await fetch(`/api/chat/conversations${params.toString() ? `?${params}` : ""}`, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Failed to fetch conversations.");

      const payload = (await response.json()) as { conversations?: Conversation[] };
      set({ conversations: payload.conversations ?? [] });
    } catch {
      set({ conversations: [] });
    } finally {
      set({ isFetchingConversations: false });
    }
  },
  upsertConversation: (conversation) =>
    set((state) => {
      const existing = state.conversations.findIndex((item) => item.id === conversation.id);
      if (existing === -1) return { conversations: [conversation, ...state.conversations] };
      const updated = [...state.conversations];
      updated[existing] = { ...updated[existing], ...conversation };
      return { conversations: updated };
    }),
  removeConversation: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.filter((item) => item.id !== conversationId),
      currentConversationId: state.currentConversationId === conversationId ? null : state.currentConversationId,
      currentConversation: state.currentConversation?.id === conversationId ? null : state.currentConversation,
      messages: state.currentConversationId === conversationId ? [] : state.messages,
    })),
  setCurrentConversationId: (currentConversationId) => set({ currentConversationId }),
  setCurrentConversation: (currentConversation) => set({ currentConversation }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (messageId, updates) =>
    set((state) => ({
      messages: state.messages.map((message) => (message.id === messageId ? { ...message, ...updates } : message)),
    })),
  updateStreamingText: (streamingText) => set({ streamingText }),
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  setSelectedMode: (selectedMode) => set({ selectedMode }),
  setSelectedModule: (selectedModule) => set({ selectedModule }),
  clearChat: () =>
    set({
      messages: [],
      currentConversationId: null,
      currentConversation: null,
      streamingText: "",
      isStreaming: false,
    }),
}));
