export async function applyNoisewareFilter(imageBlob: Blob): Promise<Blob> {
  const image = await loadBlobAsImage(imageBlob);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  if (!ctx) {
    throw new Error("Failed to get canvas context for noiseware filter");
  }

  const width = image.width;
  const height = image.height;
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0);

  const imgData = ctx.getImageData(0, 0, width, height);
  const src = imgData.data;
  const dst = new Uint8ClampedArray(src.length);

  // Configuration for Edge-Preserving Surface Blur
  const radius = 3; 
  const threshold = 35; // Maximum color difference to be considered "same surface"

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Skip fully transparent pixels
      if (src[idx + 3] === 0) {
        dst[idx] = src[idx];
        dst[idx + 1] = src[idx + 1];
        dst[idx + 2] = src[idx + 2];
        dst[idx + 3] = src[idx + 3];
        continue;
      }

      const cr = src[idx];
      const cg = src[idx + 1];
      const cb = src[idx + 2];

      let sumR = 0, sumG = 0, sumB = 0, weightSum = 0;

      for (let dy = -radius; dy <= radius; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;

        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= width) continue;

          const nIdx = (ny * width + nx) * 4;
          if (src[nIdx + 3] === 0) continue; // skip transparent neighbors

          const nr = src[nIdx];
          const ng = src[nIdx + 1];
          const nb = src[nIdx + 2];

          // Compute absolute color distance
          const dr = Math.abs(cr - nr);
          const dg = Math.abs(cg - ng);
          const db = Math.abs(cb - nb);
          
          // If the pixel is similar enough, include it in the blur average
          if (dr < threshold && dg < threshold && db < threshold) {
             // Linear falloff weight based on max difference
             const maxDiff = Math.max(dr, dg, db);
             const weight = 1 - (maxDiff / threshold);
             
             sumR += nr * weight;
             sumG += ng * weight;
             sumB += nb * weight;
             weightSum += weight;
          }
        }
      }

      if (weightSum > 0) {
        dst[idx] = Math.round(sumR / weightSum);
        dst[idx + 1] = Math.round(sumG / weightSum);
        dst[idx + 2] = Math.round(sumB / weightSum);
        dst[idx + 3] = src[idx + 3];
      } else {
        dst[idx] = cr;
        dst[idx + 1] = cg;
        dst[idx + 2] = cb;
        dst[idx + 3] = src[idx + 3];
      }
    }
  }

  // Copy processed data back
  for(let i = 0; i < src.length; i++) {
    src[i] = dst[i];
  }

  ctx.putImageData(imgData, 0, 0);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create noiseware image blob"));
      },
      "image/png",
      1.0
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
