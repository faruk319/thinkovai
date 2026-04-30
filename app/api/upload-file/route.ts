import { NextResponse } from "next/server";
import { generateMapFromImage, generateMapFromPDFText } from "@/lib/nvidia";
import { convertToReactFlow } from "@/lib/mapConverter";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

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

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only PDF and image files (JPEG, PNG, WebP, GIF) are allowed." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        { success: false, error: `File is too large (${sizeMB}MB). Maximum allowed size is 5MB.` },
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
