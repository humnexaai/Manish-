import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProvider, getModelForMode, getTemperatureForMode } from "@/lib/ai/router";
import { getSystemPrompt } from "@/lib/ai/system-prompts";
import type { AIMessage } from "@/lib/ai/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface ChatBody {
  message?: string;
  conversation_id?: string;
  mode?: string;
  module?: string;
}

async function insertMessage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  payload: {
    conversation_id: string;
    role: "user" | "assistant" | "system";
    content: string;
    mode: string;
    model?: string;
  },
) {
  const rich = {
    ...payload,
    model: payload.model ?? "default",
    tokens_in: 0,
    tokens_out: 0,
    attachments: [],
    citations: [],
  };
  const { error } = await supabase.from("messages").insert(rich);
  if (!error) return;
  await supabase.from("messages").insert(payload);
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = (await request.json()) as ChatBody;
    const message = body.message?.trim();
    const mode = body.mode ?? "auto";
    const moduleName = body.module ?? "chat";

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let convId = body.conversation_id;
    if (!convId) {
      const { data: newConv, error: convError } = await supabase
        .from("conversations")
        .insert({
          user_id: user.id,
          title: message.substring(0, 100),
          module: moduleName,
          model: getModelForMode(mode),
        })
        .select("id")
        .single();

      if (convError || !newConv?.id) throw convError ?? new Error("Failed to create conversation");
      convId = newConv.id as string;
    } else {
      const { data: existingConv, error } = await supabase
        .from("conversations")
        .select("id")
        .eq("id", convId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error || !existingConv) {
        return new Response(JSON.stringify({ error: "Conversation not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    await insertMessage(supabase, {
      conversation_id: convId,
      role: "user",
      content: message,
      mode,
    });

    const { data: history } = await supabase
      .from("messages")
      .select("role, content")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true })
      .limit(20);

    const systemPrompt = getSystemPrompt(mode, moduleName);
    const aiMessages: AIMessage[] = [
      { role: "system", content: systemPrompt },
      ...((history ?? []) as Array<{ role: "user" | "assistant" | "system"; content: string }>).map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    if (aiMessages[aiMessages.length - 1]?.content !== message) {
      aiMessages.push({ role: "user", content: message });
    }

    const provider = getProvider();
    const model = getModelForMode(mode);
    const temperature = getTemperatureForMode(mode);
    const encoder = new TextEncoder();
    let fullResponse = "";

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "conversation_id", conversation_id: convId })}\n\n`),
          );

          const aiStream = await provider.chat(aiMessages, {
            model,
            temperature,
            maxTokens: mode === "instant" ? 512 : 4096,
            mode,
            module: moduleName,
          });

          const reader = aiStream.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data: ")) continue;
              const data = trimmed.slice(6).trim();
              if (!data || data === "[DONE]") continue;

              try {
                const json = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
                const content = json.choices?.[0]?.delta?.content;
                if (!content) continue;

                fullResponse += content;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "content", content })}\n\n`));
              } catch {
                // skip malformed chunk lines
              }
            }
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));

          if (fullResponse.trim()) {
            await insertMessage(supabase, {
              conversation_id: convId,
              role: "assistant",
              content: fullResponse.trim(),
              mode,
              model,
            });
          }

          await supabase
            .from("conversations")
            .update({
              last_message_at: new Date().toISOString(),
              model,
            })
            .eq("id", convId);

          if (!body.conversation_id) {
            try {
              const titleResponse = await provider.chatSync(
                [
                  {
                    role: "system",
                    content:
                      "Generate a short 4-6 word title for this conversation. Reply with ONLY the title in the same language as the message. No quotes, no extra text.",
                  },
                  { role: "user", content: message },
                ],
                { model: "llama-3.1-8b-instant", temperature: 0.3, maxTokens: 30 },
              );

              const title = titleResponse.trim().substring(0, 100);
              if (title) {
                await supabase.from("conversations").update({ title }).eq("id", convId);
              }
            } catch {
              // non-blocking title generation
            }
          }

          try {
            await supabase.from("usage_logs").insert({
              user_id: user.id,
              conversation_id: convId,
              mode,
              model,
              tokens_in: Math.ceil(aiMessages.reduce((sum, item) => sum + item.content.length / 4, 0)),
              tokens_out: Math.ceil(fullResponse.length / 4),
            });
          } catch {
            // non-critical if usage table is not created yet
          }
        } catch (error) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                error: error instanceof Error ? error.message : "AI request failed",
              })}\n\n`,
            ),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
