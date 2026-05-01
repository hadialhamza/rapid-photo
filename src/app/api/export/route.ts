import { NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File;
    const formatId = formData.get("formatId") as string;
    const widthPx = parseInt(formData.get("widthPx") as string, 10);
    const heightPx = parseInt(formData.get("heightPx") as string, 10);
    const quality = parseInt(formData.get("quality") as string || "100", 10);

    if (!imageFile || !formatId || !widthPx || !heightPx) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process image with Sharp
    const processedImageBuffer = await sharp(buffer)
      .resize(widthPx, heightPx, { fit: "fill" })
      .withMetadata({ density: 300 }) // Set DPI to 300
      .jpeg({ quality }) // Export as high-quality JPEG
      .toBuffer();

    const response = new NextResponse(processedImageBuffer as unknown as BodyInit);
    response.headers.set("Content-Type", "image/jpeg");
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="passport-photo-${formatId}.jpg"`
    );
    
    return response;
  } catch (error) {
    console.error("Export processing error:", error);
    return NextResponse.json(
      { error: "Failed to process image for export" },
      { status: 500 }
    );
  }
}
