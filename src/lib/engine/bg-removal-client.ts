const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

// Send a cropped image to the server for background removal
export async function removeBackground(imageBlob: Blob): Promise<Blob> {
  let lastError = "";

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const formData = new FormData();
    formData.append("image", imageBlob, "photo.png");

    const response = await fetch("/api/remove-bg", {
      method: "POST",
      body: formData,
    });

    // Return the transparent PNG blob
    if (response.ok) {
      return response.blob();
    }

    // Model cold start — wait and retry
    if (response.status === 503) {
      const data = await response.json().catch(() => null);
      if (data?.retryable && attempt < MAX_RETRIES - 1) {
        await sleep(RETRY_DELAY_MS);
        continue;
      }
    }

    const responseText = await response.text().catch(() => "");
    try {
      const errorData = JSON.parse(responseText);
      lastError = errorData.error || `Server error (${response.status})`;
    } catch {
      lastError = `Server error (${response.status}). Please restart the dev server and try again.`;
    }
    break;
  }

  throw new Error(lastError || "Background removal failed after retries.");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
