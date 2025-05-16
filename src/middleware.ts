import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/Lib/jwt";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const url = request.nextUrl.clone();

  const publicPaths = ["/login"];

  if (publicPaths.some((path) => url.pathname.startsWith(path))) {
    if (token) {
      try {
        await verifyToken(token);
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  const protectedPaths = ["/dashboard", "/admin"];

  if (protectedPaths.some((path) => url.pathname.startsWith(path))) {
    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    try {
      await verifyToken(token);
      return NextResponse.next();
    } catch {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*", "/admin/:path*"],
};
