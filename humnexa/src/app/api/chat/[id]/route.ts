import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Params {
  params: { id: string };
}

async function getAuthedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { supabase, user, error };
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { supabase, user, error } = await getAuthedUser();
    if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (convError || !conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    if ((conversation as { deleted_at?: string | null }).deleted_at) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const { data: messages, error: messageError } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", params.id)
      .order("created_at", { ascending: true });
    if (messageError) throw messageError;

    return NextResponse.json({ conversation, messages: messages ?? [] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch conversation." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { supabase, user, error } = await getAuthedUser();
    if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const updates: Record<string, unknown> = {};
    const allowed = ["title", "is_pinned", "is_archived", "module", "project_id"] as const;
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }
    if (!Object.keys(updates).length) {
      return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
    }
    updates.updated_at = new Date().toISOString();

    let { data, error: updateError } = await supabase
      .from("conversations")
      .update(updates)
      .eq("id", params.id)
      .eq("user_id", user.id)
      .select("*")
      .maybeSingle();

    if (updateError) {
      delete updates.updated_at;
      const fallback = await supabase
        .from("conversations")
        .update(updates)
        .eq("id", params.id)
        .eq("user_id", user.id)
        .select("*")
        .maybeSingle();
      data = fallback.data;
      updateError = fallback.error;
    }

    if (updateError || !data) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    return NextResponse.json({ conversation: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update conversation." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { supabase, user, error } = await getAuthedUser();
    if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let deleteError = null;
    const softDelete = await supabase
      .from("conversations")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", params.id)
      .eq("user_id", user.id);
    deleteError = softDelete.error;

    if (deleteError) {
      // Backward compatibility where deleted_at does not exist.
      const hardDelete = await supabase.from("conversations").delete().eq("id", params.id).eq("user_id", user.id);
      deleteError = hardDelete.error;
    }

    if (deleteError) throw deleteError;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete conversation." },
      { status: 500 },
    );
  }
}
