import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = request.nextUrl.searchParams;
    const limit = Math.max(1, Math.min(Number(params.get("limit") || 50), 200));
    const moduleName = params.get("module")?.trim();
    const search = params.get("search")?.trim();

    let query = supabase
      .from("conversations")
      .select("id,title,module,is_pinned,is_archived,message_count,last_message_at,created_at,updated_at,deleted_at")
      .eq("user_id", user.id)
      .order("is_pinned", { ascending: false })
      .order("last_message_at", { ascending: false })
      .limit(limit);

    if (moduleName) query = query.eq("module", moduleName);
    if (search) query = query.ilike("title", `%${search}%`);

    let { data, error } = await query.is("deleted_at", null);

    if (error) {
      // Backward compatibility for schemas without deleted_at.
      const fallback = await supabase
        .from("conversations")
        .select("id,title,module,is_pinned,is_archived,message_count,last_message_at,created_at,updated_at")
        .eq("user_id", user.id)
        .order("is_pinned", { ascending: false })
        .order("last_message_at", { ascending: false })
        .limit(limit);
      data = (fallback.data ?? []).map((item) => ({ ...item, deleted_at: null }));
      error = fallback.error;
    }

    if (error) throw error;
    return NextResponse.json({ conversations: data ?? [] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch conversations." },
      { status: 500 },
    );
  }
}
