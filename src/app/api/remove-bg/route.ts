import { NextRequest } from "next/server";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // Collect all REMOVE_BG_API_KEY_* from process.env
    const apiKeys: string[] = [];
    for (const [key, value] of Object.entries(process.env)) {
      if (key.startsWith("REMOVE_BG_API_KEY_") && value) {
        apiKeys.push(value);
      }
    }

    if (apiKeys.length === 0) {
      return Response.json(
        { error: "No API keys configured for background removal." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get("image") as Blob | null;

    if (!imageFile) {
      return Response.json({ error: "No image provided" }, { status: 400 });
    }

    let lastError: unknown = null;

    for (const apiKey of apiKeys) {
      try {
        const removeBgFormData = new FormData();
        removeBgFormData.append("image_file", imageFile);
        removeBgFormData.append("size", "auto");

        const response = await fetch("https://api.remove.bg/v1.0/removebg", {
          method: "POST",
          headers: {
            "X-Api-Key": apiKey,
          },
          body: removeBgFormData,
        });

        if (response.ok) {
          const resultBlob = await response.blob();
          return new Response(resultBlob, {
            status: 200,
            headers: {
              "Content-Type": resultBlob.type || "image/png",
              "Cache-Control": "no-store",
            },
          });
        }

        // Handle specific rate limits from remove.bg
        // 402 = Payment Required (insufficient credits)
        // 429 = Too Many Requests (rate limit)
        if (response.status === 402 || response.status === 429) {
          lastError = `Rate limit or insufficient credits on current key. Moving to next.`;
          console.warn(lastError);
          continue; // Try the next key
        }

        const errorText = await response.text();
        throw new Error(`remove.bg API error: ${response.status} ${errorText}`);

      } catch (error) {
        console.error("Error with API key:", error);
        lastError = error;
      }
    }

    // If we reach here, all keys failed.
    return Response.json(
      { error: "All available API keys exceeded limits or failed. Please try again later or contact support.", retryable: false },
      { status: 429 }
    );

  } catch (error: unknown) {
    console.error("Background removal error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return Response.json(
      { error: errorMessage || "Background removal failed" },
      { status: 500 }
    );
  }
}
