import OpenAI from "openai";

// Lazy-initialized NVIDIA NIM client
let _nvidia: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_nvidia) {
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      throw new Error("NVIDIA_API_KEY is not set in environment variables!");
    }
    _nvidia = new OpenAI({
      baseURL: "https://integrate.api.nvidia.com/v1",
      apiKey,
    });
  }
  return _nvidia;
}

const MODEL_NAME = process.env.NVIDIA_MODEL || "meta/llama-3.1-70b-instruct";

export async function generateMapFromText(topic: string) {
  const response = await getClient().chat.completions.create({
    model: MODEL_NAME,
    messages: [
      {
        role: "system",
        content: `You are a mind map generator. 
When user gives a topic, return ONLY valid JSON.
Format:
{
  "title": "Topic Name",
  "nodes": [
    { "id": "1", "label": "Main Topic", "type": "root" },
    { "id": "2", "label": "Subtopic 1", "type": "branch" },
    { "id": "3", "label": "Subtopic 2", "type": "branch" },
    { "id": "4", "label": "Detail 1", "type": "leaf" }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2" },
    { "id": "e1-3", "source": "1", "target": "3" },
    { "id": "e2-4", "source": "2", "target": "4" }
  ]
}
Generate a comprehensive mind map with at least 10-15 nodes covering all important aspects.
Each root has branches, and branches can have leaves for details.
Return ONLY JSON. No explanation. No markdown. No code fences.`,
      },
      {
        role: "user",
        content: `Create a detailed mind map about: ${topic}`,
      },
    ],
    temperature: 0.2,
    max_tokens: 8192,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content || "";
  
  // Robust JSON extraction
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(content);
  } catch (e) {
    console.error("Failed to parse AI response as JSON:", content);
    throw new Error("AI returned invalid JSON format.");
  }
}

export async function generateMapFromImage(base64Image: string) {
  const response = await getClient().chat.completions.create({
    model: "nvidia/llama-3.2-11b-vision-instruct",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Create a detailed mind map from this image content in JSON format." },
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${base64Image}` },
          },
        ],
      },
    ],
    max_tokens: 4096,
  });

  const content = response.choices[0]?.message?.content || "";
  
  // Robust JSON extraction
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(content);
  } catch (e) {
    console.error("Failed to parse AI response as JSON:", content);
    throw new Error("AI returned invalid JSON format.");
  }
}

export async function generateMapFromPDFText(text: string) {
  return generateMapFromText(text);
}

export async function chatWithMap(
  message: string,
  mapContext: string,
  history: { role: "user" | "assistant"; content: string }[]
) {
  const messages: any[] = [
    {
      role: "system",
      content: `You are an AI assistant for a mind mapping tool called Thinkovai.
The user is viewing a mind map. Here is the current map context:
${mapContext}

Help the user understand, expand, or modify their mind map.`,
    },
    ...history,
    { role: "user", content: message },
  ];

  const response = await getClient().chat.completions.create({
    model: MODEL_NAME,
    messages,
    temperature: 0.7,
    max_tokens: 4096,
  });

  return response.choices[0]?.message?.content || "Sorry, I could not process your request.";
}
