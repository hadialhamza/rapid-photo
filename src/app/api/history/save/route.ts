import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadBuffer } from "@/lib/cloudinary/upload";

export async function POST(req: Request) {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // 2. Parse request FormData
    const formData = await req.formData();
    const imageFile = formData.get("image") as File;
    const formatId = formData.get("formatId") as string;
    const formatName = formData.get("formatName") as string;
    const dimensions = formData.get("dimensions") as string;

    if (!imageFile || !formatId || !formatName || !dimensions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 3. Convert image File to Buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Upload buffer to Cloudinary
    const uploadResult = await uploadBuffer(buffer);

    // 5. Insert history record into Supabase DB
    const { error: dbError } = await supabase
      .from("user_images")
      .insert({
        user_id: user.id,
        image_url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        format_id: formatId,
        format_name: formatName,
        dimensions: dimensions,
      });

    if (dbError) {
      console.error("Database insert error:", dbError.message);
      return NextResponse.json({ error: "Failed to log image history record" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      imageUrl: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Save image history error:", error);
    return NextResponse.json({ error: "Failed to save image history" }, { status: 500 });
  }
}
