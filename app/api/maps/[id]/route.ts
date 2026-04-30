import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// GET: Fetch a single map by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: map, error } = await supabase
      .from("mindmaps")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !map) {
      return NextResponse.json({ error: "Map not found" }, { status: 404 });
    }

    return NextResponse.json({ map });
  } catch (error) {
    console.error("Error fetching map:", error);
    return NextResponse.json(
      { error: "Failed to fetch map" },
      { status: 500 }
    );
  }
}

// PATCH: Update a map
export async function PATCH(
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

    const body = await request.json();
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.title !== undefined) updateData.title = body.title;
    if (body.data !== undefined) updateData.data = body.data;
    if (body.is_public !== undefined) updateData.is_public = body.is_public;

    const { data: map, error } = await supabase
      .from("mindmaps")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ map });
  } catch (error) {
    console.error("Error updating map:", error);
    return NextResponse.json(
      { error: "Failed to update map" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a map
export async function DELETE(
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

    const { error } = await supabase
      .from("mindmaps")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting map:", error);
    return NextResponse.json(
      { error: "Failed to delete map" },
      { status: 500 }
    );
  }
}
