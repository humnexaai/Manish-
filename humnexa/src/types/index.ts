export interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  plan: "free" | "plus" | "pro";
  plan_expires_at: string | null;
  language: string;
  is_active: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  module: string;
  model: string;
  is_pinned: boolean;
  is_archived: boolean;
  project_id: string | null;
  message_count: number;
  last_message_at: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  mode: string;
  model: string;
  tokens_in: number;
  tokens_out: number;
  attachments: Array<Record<string, unknown>>;
  citations: Array<Record<string, unknown>>;
  created_at: string;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  font_size: "sm" | "md" | "lg";
  default_ai_mode: string;
  default_module: string;
  sidebar_collapsed: boolean;
  memory_enabled: boolean;
  language: string;
  response_style: "concise" | "balanced" | "detailed";
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  instructions: string | null;
  color: string;
  icon: string;
  conversation_count: number;
}

export interface AIMode {
  id: string;
  name: string;
  color: string;
  icon: string;
  shortcut: string;
  description: string;
  temperature: number;
  maxTokens: number;
}

export interface Module {
  id: string;
  name: string;
  icon: string;
  route: string;
  description: string;
  phase: 1 | 2;
}

export interface Plan {
  id: "free" | "plus" | "pro";
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  limits: Record<string, number>;
}

export interface ChatInputState {
  message: string;
  mode: AIMode;
  module: Module;
  attachments: File[];
  isStreaming: boolean;
}

export interface StreamChunk {
  content?: string;
  type: "content" | "done" | "error";
  error?: string;
}
