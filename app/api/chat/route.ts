import { NextResponse } from "next/server";
import { chatWithMap } from "@/lib/openrouter";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history = [], mapContext = "" } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const reply = await chatWithMap(message, mapContext, history);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to process chat",
      },
      { status: 500 }
    );
  }
}
