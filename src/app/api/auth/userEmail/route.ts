import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/Lib/jwt";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-api-key");
  if (secret !== "secret") {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await verifyToken(token);

    return NextResponse.json({ email: user.email });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
