import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { randomBytes } from "crypto";

// POST: Generate a share link
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate a unique share token
    const shareToken = randomBytes(16).toString("hex");

    const { data: map, error } = await supabase
      .from("mindmaps")
      .update({
        is_public: true,
        share_token: shareToken,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/share/${shareToken}`;

    return NextResponse.json({ shareUrl, token: shareToken, map });
  } catch (error) {
    console.error("Error sharing map:", error);
    return NextResponse.json(
      { error: "Failed to share map" },
      { status: 500 }
    );
  }
}
