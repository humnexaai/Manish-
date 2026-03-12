import { GroqProvider } from "./groq-provider";
import type { AIProvider } from "./types";

function normalizeMode(mode: string) {
  return mode.replace(/-/g, "_").toLowerCase();
}

export function getProvider(): AIProvider {
  return new GroqProvider();
}

export function getModelForMode(mode: string): string {
  switch (normalizeMode(mode)) {
    case "instant":
    case "auto":
    case "think_quick":
      return "llama-3.1-8b-instant";
    case "think_deep":
    case "think_expert":
    case "research":
    case "code":
    case "learn":
      return "llama-3.1-70b-versatile";
    default:
      return "llama-3.1-8b-instant";
  }
}

export function getTemperatureForMode(mode: string): number {
  switch (normalizeMode(mode)) {
    case "instant":
      return 0.3;
    case "code":
      return 0.2;
    case "think_expert":
      return 0.4;
    case "think_quick":
      return 0.5;
    case "research":
      return 0.5;
    case "think_deep":
      return 0.6;
    case "learn":
      return 0.6;
    case "auto":
    default:
      return 0.7;
  }
}
