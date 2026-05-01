export async function downloadFinalPhoto(
  blob: Blob,
  formatId: string,
  widthPx: number,
  heightPx: number,
  quality: number = 100
): Promise<void> {
  const formData = new FormData();
  formData.append("image", blob, "photo.png");
  formData.append("formatId", formatId);
  formData.append("widthPx", widthPx.toString());
  formData.append("heightPx", heightPx.toString());
  formData.append("quality", quality.toString());

  const response = await fetch("/api/export", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to export photo");
  }

  const finalBlob = await response.blob();
  const downloadUrl = URL.createObjectURL(finalBlob);
  
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = `passport-photo-${formatId}.jpg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
