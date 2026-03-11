"use client";

import { create } from "zustand";
import { AI_MODES, MODULES } from "@/lib/constants";
import type { AIMode, Conversation, Message, Module } from "@/types";

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isStreaming: boolean;
  streamingText: string;
  selectedMode: AIMode;
  selectedModule: Module;
  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversation: (conversation: Conversation | null) => void;
  addMessage: (message: Message) => void;
  updateStreamingText: (text: string) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  setSelectedMode: (mode: AIMode) => void;
  setSelectedModule: (module: Module) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  isStreaming: false,
  streamingText: "",
  selectedMode: AI_MODES[0],
  selectedModule: MODULES[0],

  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (currentConversation) => set({ currentConversation }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateStreamingText: (streamingText) => set({ streamingText }),
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  setSelectedMode: (selectedMode) => set({ selectedMode }),
  setSelectedModule: (selectedModule) => set({ selectedModule }),
  clearChat: () =>
    set({
      messages: [],
      currentConversation: null,
      streamingText: "",
      isStreaming: false,
    }),
}));
