import type { AIMode, Module, Plan } from "@/types";

export const APP_NAME = "Humnexa";
export const APP_TAGLINE = "Bolo Aur Ho Jaye";
export const APP_DESCRIPTION =
  "India's first Hindi-first AI platform built for chat, learning, documents, coding, and productivity.";

export const AI_MODES: AIMode[] = [
  {
    id: "auto",
    name: "Auto",
    color: "#FF6B2C",
    icon: "Sparkles",
    shortcut: "A",
    description: "Automatically picks the best style for your prompt.",
    temperature: 0.7,
    maxTokens: 2048,
  },
  {
    id: "instant",
    name: "Instant",
    color: "#F59E0B",
    icon: "Zap",
    shortcut: "I",
    description: "Fast answers with concise responses.",
    temperature: 0.4,
    maxTokens: 1024,
  },
  {
    id: "think-quick",
    name: "Think Quick",
    color: "#6366F1",
    icon: "Brain",
    shortcut: "Q",
    description: "Balanced reasoning for day-to-day tasks.",
    temperature: 0.5,
    maxTokens: 2048,
  },
  {
    id: "think-deep",
    name: "Think Deep",
    color: "#4F46E5",
    icon: "Brain",
    shortcut: "D",
    description: "Long-form thoughtful analysis and deeper reasoning.",
    temperature: 0.6,
    maxTokens: 4096,
  },
  {
    id: "think-expert",
    name: "Think Expert",
    color: "#3730A3",
    icon: "Brain",
    shortcut: "E",
    description: "Expert-level structure for advanced workflows.",
    temperature: 0.45,
    maxTokens: 4096,
  },
  {
    id: "research",
    name: "Research",
    color: "#10B981",
    icon: "Search",
    shortcut: "R",
    description: "Source-backed, methodical exploration.",
    temperature: 0.35,
    maxTokens: 4096,
  },
  {
    id: "code",
    name: "Code",
    color: "#EC4899",
    icon: "Code",
    shortcut: "C",
    description: "Coding, debugging, and architecture support.",
    temperature: 0.25,
    maxTokens: 4096,
  },
  {
    id: "learn",
    name: "Learn",
    color: "#8B5CF6",
    icon: "GraduationCap",
    shortcut: "L",
    description: "Step-by-step explanations and exam prep.",
    temperature: 0.65,
    maxTokens: 3072,
  },
];

export const MODULES: Module[] = [
  {
    id: "chat",
    name: "Chat",
    icon: "MessageSquare",
    route: "/chat",
    description: "General chat and assistant conversations.",
    phase: 1,
  },
  {
    id: "docs",
    name: "Docs",
    icon: "FileText",
    route: "/docs",
    description: "Summarize and query documents.",
    phase: 1,
  },
  {
    id: "data",
    name: "Data",
    icon: "BarChart3",
    route: "/data",
    description: "Analyze CSV, reports, and metrics.",
    phase: 1,
  },
  {
    id: "image",
    name: "Image",
    icon: "ImageIcon",
    route: "/image",
    description: "Image generation and editing workflows.",
    phase: 2,
  },
  {
    id: "learn",
    name: "Learn",
    icon: "GraduationCap",
    route: "/learn",
    description: "Study mode and guided learning paths.",
    phase: 1,
  },
  {
    id: "write",
    name: "Write",
    icon: "PenTool",
    route: "/write",
    description: "Draft emails, posts, and professional writing.",
    phase: 1,
  },
  {
    id: "code",
    name: "Code",
    icon: "Code",
    route: "/code",
    description: "Code generation, debugging, and explanations.",
    phase: 1,
  },
  {
    id: "search",
    name: "Search",
    icon: "Globe",
    route: "/search",
    description: "Web-informed answers with latest context.",
    phase: 1,
  },
  {
    id: "voice",
    name: "Voice",
    icon: "Mic",
    route: "/voice",
    description: "Voice-driven conversations and tasks.",
    phase: 2,
  },
  {
    id: "tools",
    name: "Tools",
    icon: "Wrench",
    route: "/tools",
    description: "Utility workflows and mini-app integrations.",
    phase: 2,
  },
];

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price_monthly: 0,
    price_yearly: 0,
    features: [
      "Basic AI chat",
      "Up to 100 messages/day",
      "Standard response speed",
      "10 MB file uploads",
    ],
    limits: {
      messagesPerDay: 100,
      maxProjects: 3,
      maxStorageGb: 1,
    },
  },
  {
    id: "plus",
    name: "Plus",
    price_monthly: 199,
    price_yearly: 1990,
    features: [
      "Everything in Free",
      "Priority response speed",
      "Advanced AI modes",
      "25 MB file uploads",
      "Higher context window",
    ],
    limits: {
      messagesPerDay: 1000,
      maxProjects: 25,
      maxStorageGb: 10,
    },
  },
  {
    id: "pro",
    name: "Pro",
    price_monthly: 499,
    price_yearly: 4990,
    features: [
      "Everything in Plus",
      "Unlimited chats",
      "Team-ready workflows",
      "50 MB file uploads",
      "Research and code power mode",
    ],
    limits: {
      messagesPerDay: -1,
      maxProjects: -1,
      maxStorageGb: 100,
    },
  },
];

export const NAV_LINKS = [
  { id: "features", label: "Features", href: "#features" },
  { id: "pricing", label: "Pricing", href: "#pricing" },
  { id: "about", label: "About", href: "/about" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export const SUPPORTED_LANGUAGES = [
  { code: "hi", name: "Hindi", native_name: "हिन्दी" },
  { code: "en", name: "English", native_name: "English" },
  { code: "ta", name: "Tamil", native_name: "தமிழ்" },
  { code: "te", name: "Telugu", native_name: "తెలుగు" },
  { code: "bn", name: "Bengali", native_name: "বাংলা" },
  { code: "mr", name: "Marathi", native_name: "मराठी" },
  { code: "gu", name: "Gujarati", native_name: "ગુજરાતી" },
  { code: "kn", name: "Kannada", native_name: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", native_name: "മലയാളം" },
  { code: "pa", name: "Punjabi", native_name: "ਪੰਜਾਬੀ" },
  { code: "ur", name: "Urdu", native_name: "اردو" },
  { code: "or", name: "Odia", native_name: "ଓଡ଼ିଆ" },
];

export const MAX_FILE_SIZES = {
  free: 10 * 1024 * 1024,
  plus: 25 * 1024 * 1024,
  pro: 50 * 1024 * 1024,
};

export const ACCEPTED_FILE_TYPES = {
  documents: [
    "application/pdf",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ],
  images: ["image/png", "image/jpeg", "image/webp", "image/gif"],
  audio: ["audio/mpeg", "audio/wav", "audio/ogg"],
  code: [
    "text/javascript",
    "application/json",
    "text/x-python",
    "text/x-java-source",
    "text/x-c",
    "text/x-c++",
  ],
};
