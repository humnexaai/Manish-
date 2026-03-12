import { format, formatDistanceToNow, isToday, isYesterday, subDays } from "date-fns";
import type { Conversation } from "@/types";

export function formatRelativeTime(date: string | Date): string {
  const value = typeof date === "string" ? new Date(date) : date;
  if (isToday(value)) return formatDistanceToNow(value, { addSuffix: true });
  if (isYesterday(value)) return "Yesterday";
  return format(value, "MMM d");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1))}…`;
}

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function groupConversationsByDate(conversations: Conversation[]): Record<string, Conversation[]> {
  const groups: Record<string, Conversation[]> = {
    Today: [],
    Yesterday: [],
    "Previous 7 Days": [],
    Older: [],
  };

  const sevenDaysAgo = subDays(new Date(), 7);
  conversations.forEach((conversation) => {
    const when = new Date(conversation.last_message_at || conversation.created_at);
    if (isToday(when)) groups.Today.push(conversation);
    else if (isYesterday(when)) groups.Yesterday.push(conversation);
    else if (when >= sevenDaysAgo) groups["Previous 7 Days"].push(conversation);
    else groups.Older.push(conversation);
  });

  return groups;
}

export function debounce<T extends (...args: any[]) => any>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const wrapped = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
  return wrapped as T;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
