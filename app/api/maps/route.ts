import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// GET: Fetch all maps for the logged-in user
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: maps, error } = await supabase
      .from("mindmaps")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ maps: maps || [] });
  } catch (error) {
    console.error("Error fetching maps:", error);
    return NextResponse.json(
      { error: "Failed to fetch maps" },
      { status: 500 }
    );
  }
}

// POST: Create a new map
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title = "Untitled Map", data = { nodes: [], edges: [] } } = body;

    const { data: map, error } = await supabase
      .from("mindmaps")
      .insert({
        user_id: user.id,
        title,
        data,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ map });
  } catch (error) {
    console.error("Error creating map:", error);
    return NextResponse.json(
      { error: "Failed to create map" },
      { status: 500 }
    );
  }
}
