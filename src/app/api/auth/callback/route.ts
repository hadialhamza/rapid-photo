import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && session?.user) {
      // Check profile ban status
      const { data: profile } = await supabase
        .from("profiles")
        .select("status")
        .eq("id", session.user.id)
        .single();

      if (profile?.status === "banned") {
        await supabase.auth.signOut(); // Clear cookies immediately on the server
        return NextResponse.redirect(`${origin}/?auth=banned`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/?auth=error`);
}
