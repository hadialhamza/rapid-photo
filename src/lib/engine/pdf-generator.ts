import { jsPDF } from "jspdf";
import { CartItem } from "@/store/print-cart-store";

export async function generatePrintLayoutPdf(items: CartItem[]): Promise<Blob> {
  // Create A4 PDF (210 x 297 mm)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const PAGE_WIDTH = 210;
  const PAGE_HEIGHT = 297;
  const PAGE_MARGIN = 3;
  const ITEM_SPACING = 3; // Gap between photos for cutting

  let currentX = PAGE_MARGIN;
  let currentY = PAGE_MARGIN;
  let maxRowHeight = 0;

  // Flatten items into individual photos based on copies
  const photosToPrint: { url: string; width: number; height: number }[] = [];
  for (const item of items) {
    for (let i = 0; i < item.copies; i++) {
      // Dimensions are usually in formats like "40 × 50 mm" or "35x45"
      // Handle both 'x' and '×' characters
      const dimensionsStr = item.format.dimensionsMm.replace("mm", "").trim();
      const splitChar = dimensionsStr.includes("×") ? "×" : "x";
      const [w, h] = dimensionsStr.split(splitChar).map((s) => parseFloat(s.trim()));
      photosToPrint.push({
        url: item.imageUrl,
        width: w,
        height: h,
      });
    }
  }

  // Load all images first
  const imageElements = await Promise.all(
    photosToPrint.map(async (photo) => {
      const img = new Image();
      img.src = photo.url;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      return { img, width: photo.width, height: photo.height };
    })
  );

  // Place images on PDF
  for (let i = 0; i < imageElements.length; i++) {
    const { img, width, height } = imageElements[i];

    // Check if we need to wrap to next line
    if (currentX + width > PAGE_WIDTH - PAGE_MARGIN) {
      currentX = PAGE_MARGIN;
      currentY += maxRowHeight + ITEM_SPACING;
      maxRowHeight = 0;
    }

    // Check if we need a new page
    if (currentY + height > PAGE_HEIGHT - PAGE_MARGIN) {
      doc.addPage();
      currentX = PAGE_MARGIN;
      currentY = PAGE_MARGIN;
      maxRowHeight = 0;
    }

    // Draw the image
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const imgData = canvas.toDataURL("image/jpeg", 1.0);

    doc.addImage(imgData, "JPEG", currentX, currentY, width, height);

    // Draw cutting marks/borders
    doc.setDrawColor(200, 200, 200); // Light gray
    doc.setLineWidth(0.1);
    doc.rect(currentX, currentY, width, height);

    // Update positions
    currentX += width + ITEM_SPACING;
    maxRowHeight = Math.max(maxRowHeight, height);
  }

  return doc.output("blob");
}

export function downloadPdf(blob: Blob, filename: string = "print-layout.pdf") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
