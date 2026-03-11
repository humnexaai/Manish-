import { NextResponse } from "next/server";

type ChatRole = "user" | "assistant" | "system";

interface ChatMessageInput {
  role: ChatRole;
  content: string;
}

interface ChatRequestBody {
  messages?: ChatMessageInput[];
  modeId?: string;
  webSearch?: boolean;
}

const MODE_SYSTEM_HINTS: Record<string, string> = {
  auto: "Pick the best response style for the request.",
  instant: "Respond briefly and directly.",
  "think-quick": "Respond with concise reasoning and practical steps.",
  "think-deep": "Respond with deeper reasoning and structured analysis.",
  "think-expert": "Respond like an expert consultant with clear tradeoffs.",
  research: "Prioritize factual structure and clearly mention uncertainty.",
  code: "Focus on accurate, production-ready coding guidance.",
  learn: "Teach step-by-step using beginner-friendly language.",
};

function fallbackReply(lastUserMessage: string, modeId: string) {
  return [
    "AI provider key is not configured yet, so this is a local fallback response.",
    "",
    `Mode: ${modeId}`,
    "",
    "You asked:",
    lastUserMessage,
    "",
    "Set GROQ_API_KEY (or OPENAI_API_KEY) to enable real model responses.",
  ].join("\n");
}

function getProviderConfig() {
  const groqApiKey = process.env.GROQ_API_KEY?.trim();
  const openAiApiKey = process.env.OPENAI_API_KEY?.trim();

  if (groqApiKey) {
    return {
      provider: "groq" as const,
      apiKey: groqApiKey,
      model: process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-120b",
      baseUrl: process.env.GROQ_BASE_URL?.trim() || "https://api.groq.com/openai/v1",
    };
  }

  if (openAiApiKey) {
    return {
      provider: "openai" as const,
      apiKey: openAiApiKey,
      model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
      baseUrl: process.env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1",
    };
  }

  return null;
}

async function getModelReply(messages: ChatMessageInput[], modeId: string, webSearch: boolean) {
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content?.trim() ?? "";
  const provider = getProviderConfig();

  if (!provider) {
    return { reply: fallbackReply(lastUserMessage, modeId), usedFallback: true };
  }

  const systemPrompt = [
    "You are Humnexa, a multilingual assistant optimized for Indian users.",
    "Default to clear, practical answers in English or Hinglish depending on user language.",
    MODE_SYSTEM_HINTS[modeId] ?? MODE_SYSTEM_HINTS.auto,
    webSearch
      ? "The user has enabled web search intent; if you are uncertain, clearly say what needs verification."
      : "Do not claim web browsing unless explicitly provided sources.",
  ].join(" ");

  const response = await fetch(`${provider.baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${provider.apiKey}`,
    },
    body: JSON.stringify({
      model: provider.model,
      temperature: 0.6,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Model request failed (${response.status}): ${errorText.slice(0, 500)}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };

  const reply = data.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    throw new Error("Model returned an empty response.");
  }

  return { reply, usedFallback: false };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const modeId = body.modeId ?? "auto";
    const webSearch = Boolean(body.webSearch);
    const rawMessages = Array.isArray(body.messages) ? body.messages : [];
    const messages = rawMessages
      .filter((message): message is ChatMessageInput => {
        return (
          Boolean(message) &&
          (message.role === "user" || message.role === "assistant" || message.role === "system") &&
          typeof message.content === "string"
        );
      })
      .slice(-16);

    if (!messages.length) {
      return NextResponse.json({ error: "At least one message is required." }, { status: 400 });
    }

    const result = await getModelReply(messages, modeId, webSearch);
    return NextResponse.json({ reply: result.reply, modeId, fallback: result.usedFallback });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected chat API error." },
      { status: 500 },
    );
  }
}
