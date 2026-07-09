import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteImage } from "@/lib/cloudinary/upload";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
    }

    // 1. Authenticate user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // 2. Fetch record to ensure it belongs to the current user
    const { data: record, error: recordError } = await supabase
      .from("user_images")
      .select("public_id, user_id")
      .eq("id", id)
      .single();

    if (recordError || !record) {
      console.error("Fetch record to delete error:", recordError?.message);
      return NextResponse.json({ error: "Image history item not found" }, { status: 404 });
    }

    if (record.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    // 3. Destroy asset in Cloudinary
    try {
      await deleteImage(record.public_id);
    } catch (cloudinaryErr) {
      // Log error but proceed to delete db record to keep state clean
      console.error("Failed to delete Cloudinary asset:", cloudinaryErr);
    }

    // 4. Delete DB record
    const { error: dbError } = await supabase
      .from("user_images")
      .delete()
      .eq("id", id);

    if (dbError) {
      console.error("Database delete error:", dbError.message);
      return NextResponse.json({ error: "Failed to delete history record" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Image history record successfully deleted",
    });
  } catch (error) {
    console.error("Delete history error:", error);
    return NextResponse.json({ error: "Failed to delete history item" }, { status: 500 });
  }
}
