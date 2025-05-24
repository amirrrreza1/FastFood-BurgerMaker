// app/api/me/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/Lib/jwt";

export async function GET(req : NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await verifyToken(token); // مثلا user = { uid, phone, ... }

    return NextResponse.json({ user_id: user.uid });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
