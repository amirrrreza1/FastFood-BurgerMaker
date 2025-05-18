import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/Lib/jwt";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const url = request.nextUrl.clone();
  const path = url.pathname;

  const publicPaths = ["/login"];

  // ✅ مسیرهای عمومی مثل /login
  if (publicPaths.some((publicPath) => path.startsWith(publicPath))) {
    if (token) {
      try {
        const payload = await verifyToken(token);
        // اگر ادمین بود به /admin بره، اگر عادی بود به /dashboard
        url.pathname = payload.role === "admin" ? "/admin" : "/dashboard";
        return NextResponse.redirect(url);
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // ✅ مسیرهای محافظت‌شده
  const protectedPaths = ["/dashboard", "/admin"];

  if (protectedPaths.some((protectedPath) => path.startsWith(protectedPath))) {
    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    try {
      const payload = await verifyToken(token);

      // 👇 محدودیت‌های دسترسی بر اساس نقش
      if (path.startsWith("/admin") && payload.role !== "admin") {
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }

      if (path.startsWith("/dashboard") && payload.role !== "user") {
        url.pathname = "/admin";
        return NextResponse.redirect(url);
      }

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
