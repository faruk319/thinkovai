import { NextResponse } from "next/server";
import { generateMapFromImage, generateMapFromPDFText } from "@/lib/openrouter";
import { convertToReactFlow } from "@/lib/mapConverter";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File is required" },
        { status: 400 }
      );
    }

    const fileType = file.type;
    let aiData;

    if (fileType.startsWith("image/")) {
      // Convert image to base64
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      aiData = await generateMapFromImage(base64);
    } else if (fileType === "application/pdf") {
      // For PDF, extract text (basic approach — read as text)
      const bytes = await file.arrayBuffer();
      const text = Buffer.from(bytes).toString("utf-8");
      // Note: For proper PDF parsing, you'd use a library like pdf-parse
      // For MVP, we'll send the raw text content
      aiData = await generateMapFromPDFText(text);
    } else {
      return NextResponse.json(
        { success: false, error: "Only images and PDFs are supported" },
        { status: 400 }
      );
    }

    const mapData = convertToReactFlow(aiData);

    return NextResponse.json({
      success: true,
      mapData,
      title: aiData.title || file.name,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process file",
      },
      { status: 500 }
    );
  }
}
