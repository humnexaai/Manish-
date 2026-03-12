import type { AIMessage, AIProvider, AIStreamOptions } from "./types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.1-8b-instant";

function getGroqKey() {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) {
    throw new Error("GROQ_API_KEY is not configured.");
  }
  return key;
}

export class GroqProvider implements AIProvider {
  name = "groq";

  async chat(messages: AIMessage[], options?: AIStreamOptions): Promise<ReadableStream<Uint8Array>> {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getGroqKey()}`,
      },
      body: JSON.stringify({
        model: options?.model || process.env.GROQ_MODEL || DEFAULT_MODEL,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 4096,
        stream: true,
      }),
    });

    if (!response.ok || !response.body) {
      const text = await response.text().catch(() => "");
      throw new Error(`Groq API error: ${response.status} ${response.statusText} ${text}`.trim());
    }

    return response.body;
  }

  async chatSync(messages: AIMessage[], options?: AIStreamOptions): Promise<string> {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getGroqKey()}`,
      },
      body: JSON.stringify({
        model: options?.model || process.env.GROQ_MODEL || DEFAULT_MODEL,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 1024,
        stream: false,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`Groq API error: ${response.status} ${response.statusText} ${text}`.trim());
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    return data.choices?.[0]?.message?.content?.trim() || "";
  }
}
