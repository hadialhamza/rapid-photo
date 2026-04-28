import { NextRequest } from "next/server";
import { client } from "@gradio/client";

export const maxDuration = 60;

interface GradioPredictionResult {
  data: [[{ url: string }, { url: string }]];
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.HUGGING_FACE_API;

    // Parse FormData from the React client
    const formData = await request.formData();
    const imageFile = formData.get("image") as Blob | null;

    if (!imageFile) {
      return Response.json({ error: "No image provided" }, { status: 400 });
    }

    // Connect to the Gradio Space with API key
    const app = await client("not-lain/background-removal", {
      token: apiKey as `hf_${string}` | undefined,
    });

    const result = (await app.predict("/image", [
      imageFile,
    ])) as unknown as GradioPredictionResult;

    // Extract the URL based on defined type
    const processedImageUrl = result.data[0][1].url;

    // Fetch the transparent image
    const imageResponse = await fetch(processedImageUrl);
    const resultBlob = await imageResponse.blob();

    // Send it back to the frontend
    return new Response(resultBlob, {
      status: 200,
      headers: {
        "Content-Type": resultBlob.type || "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (error: unknown) {
    console.error("Gradio Space error:", error);

    // Safely narrow the error type to extract the message
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Check for cold-start or queue errors specifically
    if (errorMessage.includes("loading") || errorMessage.includes("queue")) {
      return Response.json(
        { error: "AI model is waking up. Retrying...", retryable: true },
        { status: 503 },
      );
    }

    return Response.json(
      { error: errorMessage || "Background removal failed" },
      { status: 500 },
    );
  }
}
