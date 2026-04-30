import { NextResponse } from "next/server";
import { generateMapFromText } from "@/lib/nvidia";
import { convertToReactFlow } from "@/lib/mapConverter";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic } = body;

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { success: false, error: "Topic is required" },
        { status: 400 }
      );
    }

    // Generate mind map from AI
    const aiData = await generateMapFromText(topic);

    // Convert to React Flow format with auto-layout
    const mapData = convertToReactFlow(aiData);

    return NextResponse.json({
      success: true,
      mapData,
      title: aiData.title || topic,
    });
  } catch (error) {
    console.error("=== MAP GENERATION ERROR ===");
    console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error("Stack:", error.stack);
    }
    console.error("Full error:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate mind map",
      },
      { status: 500 }
    );
  }
}
