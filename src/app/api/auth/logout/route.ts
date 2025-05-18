import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "خروج موفقیت‌آمیز بود" });

  res.cookies.set("token", "", {
    path: "/",
    maxAge: 0,
  });

  return res;
}
