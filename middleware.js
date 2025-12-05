import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  
  // Only protect specific routes
  if (pathname.startsWith("/dashboard")) {
    try {
      const { isAuthenticated } = getKindeServerSession();
      const authenticated = await isAuthenticated();
      
      if (!authenticated) {
        const loginUrl = new URL("/api/auth/login", request.url);
        loginUrl.searchParams.set("post_login_redirect_url", pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error("Middleware auth error:", error);
      // Allow access if auth check fails
      return NextResponse.next();
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
