export async function replaceBackground(
  imageBlob: Blob,
  color: string,
  width: number,
  height: number,
): Promise<Blob> {
  const image = await loadBlobAsImage(imageBlob);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  canvas.width = width;
  canvas.height = height;

  // Fill with background color
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  // Draw the transparent foreground on top
  ctx.drawImage(image, 0, 0, width, height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create composited image blob"));
        }
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
