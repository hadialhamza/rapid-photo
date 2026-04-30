const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

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

    const responseText = await response.text().catch(() => "");
    let errorData: { error?: string } = {};
    try {
      errorData = JSON.parse(responseText);
      lastError = errorData.error || `Server error (${response.status})`;
    } catch {
      lastError = `Server error (${response.status}). Please try again.`;
    }

    if (response.status === 429) {
      throw new Error(lastError || "All API limits reached. Please contact support.");
    }
    
    // For 5xx errors we might want to retry
    if (response.status >= 500 && attempt < MAX_RETRIES - 1) {
      await sleep(RETRY_DELAY_MS);
      continue;
    }

    break;
  }

  throw new Error(lastError || "Background removal failed.");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
