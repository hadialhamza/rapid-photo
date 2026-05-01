export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function enhanceLighting(
  imageBlob: Blob,
  faceRect?: Rect,
): Promise<Blob> {
  const image = await loadBlobAsImage(imageBlob);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context for lighting correction");
  }

  const width = image.width;
  const height = image.height;
  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // 1. Determine region for calculating statistics
  let statsRect = { x: 0, y: 0, width, height };
  if (faceRect) {
    statsRect = {
      x: Math.max(0, Math.floor(faceRect.x)),
      y: Math.max(0, Math.floor(faceRect.y)),
      width: Math.min(width - faceRect.x, Math.floor(faceRect.width)),
      height: Math.min(height - faceRect.y, Math.floor(faceRect.height)),
    };
  }

  let sumLum = 0;
  let count = 0;

  for (let y = statsRect.y; y < statsRect.y + statsRect.height; y++) {
    for (let x = statsRect.x; x < statsRect.x + statsRect.width; x++) {
      const idx = (y * width + x) * 4;
      // Ignore fully transparent pixels
      if (data[idx + 3] === 0) continue;

      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Perceptual luminance
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      sumLum += lum;
      count++;
    }
  }

  if (count === 0) {
    return imageBlob; // Fallback if no opaque pixels found
  }

  const avgLum = sumLum / count;

  // 3. Compute Correction Factors
  // Instead of Gray World White Balance (which makes skin pale), we just boost saturation slightly.
  const saturationBoost = 1.15; // 15% boost to prevent washed-out look

  // Brightness (Target Luminance ~ 135 for a brighter look)
  const targetLum = 135;
  const maxShift = 25; 
  // Add a slight flat brightness boost (+5) so even well-lit images get a tiny bump.
  const brightnessShift = Math.max(-5, Math.min(maxShift, (targetLum - avgLum) * 0.7)) + 5;

  // Contrast: Slightly higher contrast to make it pop safely
  const contrastMult = 1.12;

  // 4. Apply Corrections Globally
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue; // Skip transparent

    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Apply Contrast & Brightness
    r = (r - 128) * contrastMult + 128 + brightnessShift;
    g = (g - 128) * contrastMult + 128 + brightnessShift;
    b = (b - 128) * contrastMult + 128 + brightnessShift;

    // Apply Saturation Boost
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    r = lum + (r - lum) * saturationBoost;
    g = lum + (g - lum) * saturationBoost;
    b = lum + (b - lum) * saturationBoost;

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }

  ctx.putImageData(imageData, 0, 0);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create enhanced image blob"));
      },
      "image/png",
      1.0,
    );
  });
}

function loadBlobAsImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load blob as image"));
    };
    img.src = url;
  });
}
