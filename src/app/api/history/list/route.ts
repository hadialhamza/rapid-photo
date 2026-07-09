import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Query history database entries for the current user
    const { data: images, error: dbError } = await supabase
      .from("user_images")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (dbError) {
      console.error("Database select error:", dbError.message);
      return NextResponse.json({ error: "Failed to load history list" }, { status: 500 });
    }

    // Calculate daysLeft on the server-side to prevent client-side purity issues
    const imagesWithDays = (images || []).map((img) => {
      const createdTime = new Date(img.created_at).getTime();
      const daysLeft = Math.max(
        0,
        30 - Math.floor((Date.now() - createdTime) / (1000 * 60 * 60 * 24))
      );
      return {
        ...img,
        daysLeft,
      };
    });

    return NextResponse.json({
      success: true,
      images: imagesWithDays,
    });
  } catch (error) {
    console.error("List history error:", error);
    return NextResponse.json({ error: "Failed to list history" }, { status: 500 });
  }
}
