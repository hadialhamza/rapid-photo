import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteMultipleImages } from "@/lib/cloudinary/upload";

export async function POST(req: Request) {
  try {
    // Optional CRON_SECRET security check
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = req.headers.get("Authorization");
      const { searchParams } = new URL(req.url);
      const querySecret = searchParams.get("secret");

      const isAuthorized = 
        authHeader === `Bearer ${cronSecret}` || 
        querySecret === cronSecret;

      if (!isAuthorized) {
        return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
      }
    }

    // 1. Initialize Supabase client
    const supabase = await createClient();

    // 2. Calculate the timestamp for 30 days ago
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Fetch images older than 30 days (limit to 100 to stay within Cloudinary API batch limit)
    const { data: oldRecords, error: fetchError } = await supabase
      .from("user_images")
      .select("id, public_id")
      .lt("created_at", thirtyDaysAgo)
      .limit(100);

    if (fetchError) {
      console.error("Cleanup fetch records error:", fetchError.message);
      return NextResponse.json({ error: "Failed to fetch cleanup records" }, { status: 500 });
    }

    if (!oldRecords || oldRecords.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No expired images to cleanup",
        cleanedCount: 0,
      });
    }

    // 3. Extract public IDs and database record IDs
    const publicIds = oldRecords.map((r) => r.public_id).filter(Boolean);
    const recordIds = oldRecords.map((r) => r.id);

    // 4. Bulk delete assets from Cloudinary
    if (publicIds.length > 0) {
      try {
        await deleteMultipleImages(publicIds);
      } catch (cloudinaryErr) {
        console.error("Cleanup Cloudinary deletion error:", cloudinaryErr);
        // We log and continue, ensuring database records are cleaned up even if some files were already missing or deleted
      }
    }

    // 5. Delete records from Supabase DB
    const { error: deleteError } = await supabase
      .from("user_images")
      .delete()
      .in("id", recordIds);

    if (deleteError) {
      console.error("Cleanup database deletion error:", deleteError.message);
      return NextResponse.json({ error: "Failed to delete database records" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully cleaned up ${recordIds.length} expired history items`,
      cleanedCount: recordIds.length,
    });
  } catch (error) {
    console.error("Cleanup job error:", error);
    return NextResponse.json({ error: "Cleanup job failed" }, { status: 500 });
  }
}

// Support GET requests for easy curl/cron trigger compatibility
export async function GET(req: Request) {
  return POST(req);
}
