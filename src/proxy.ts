import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const allCookies = request.cookies.getAll();
  // Supabase SSR cookies always start with "sb-" prefix
  const hasSession = allCookies.some((cookie) => cookie.name.startsWith("sb-"));

  const pathname = request.nextUrl.pathname;
  
  // If there is no Supabase session cookie and the user attempts to access protected routes
  if (!hasSession && (pathname.startsWith("/editor") || pathname.startsWith("/dashboard"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("auth", "required");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/editor/:path*", "/dashboard/:path*"],
};
