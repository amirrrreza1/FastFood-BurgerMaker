import { NextResponse } from "next/server";
import { signToken } from "@/Lib/jwt";

export async function POST() {
  const token = await signToken({
    uid: "guest",
    email: "guest@fastfood.local",
    role: "guest",
    is_active: true,
  });

  const response = NextResponse.json({ message: "Guest session created" });

  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60,
  });

  response.cookies.set("sb-access-token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return response;
}
