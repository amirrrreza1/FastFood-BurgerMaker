import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/Lib/jwt";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const url = request.nextUrl.clone();
  const path = url.pathname;

  const publicPaths = ["/login", "/blocked"];
  const isPublicPath = publicPaths.some((publicPath) =>
    path.startsWith(publicPath)
  );

  if (isPublicPath) {
    if (token) {
      try {
        const payload = await verifyToken(token);

        if (!payload.is_active) {
          url.pathname = "/blocked";
          return NextResponse.redirect(url);
        }

        url.pathname = payload.role === "admin" ? "/admin" : "/profile";
        return NextResponse.redirect(url);
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    url.pathname = "/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  try {
    const payload = await verifyToken(token);

    if (!payload.is_active) {
      url.pathname = "/blocked";
      return NextResponse.redirect(url);
    }

    if (path.startsWith("/admin") && payload.role !== "admin") {
      url.pathname = "/profile";
      return NextResponse.redirect(url);
    }

    if (path.startsWith("/profile") && payload.role !== "user") {
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch {
    url.pathname = "/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    "/login",
    "/profile/:path*",
    "/admin/:path*",
    "/checkout",
    "/new-burger",
  ],
};
