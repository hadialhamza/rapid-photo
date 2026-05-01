export async function refineEdges(imageBlob: Blob): Promise<Blob> {
  const image = await loadBlobAsImage(imageBlob);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  if (!ctx) {
    throw new Error("Failed to get canvas context for edge refinement");
  }

  const width = image.width;
  const height = image.height;
  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Create a copy of the alpha channel for reference during blur
  const originalAlpha = new Uint8ClampedArray(width * height);
  for (let i = 0; i < width * height; i++) {
    originalAlpha[i] = data[i * 4 + 3];
  }

  // 3x3 Box blur on alpha channel
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      
      let sumAlpha = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const neighborIdx = (y + dy) * width + (x + dx);
          sumAlpha += originalAlpha[neighborIdx];
        }
      }
      
      const avgAlpha = sumAlpha / 9;
      // Write back to the image data
      data[idx * 4 + 3] = avgAlpha;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create refined image blob"));
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
