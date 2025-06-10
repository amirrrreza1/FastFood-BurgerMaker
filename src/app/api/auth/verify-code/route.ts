import { NextRequest, NextResponse } from "next/server";
import { codeStore } from "@/Lib/codeStore";

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();
  const storedCode = codeStore.get(email);

  if (storedCode === code) {
    return NextResponse.json({ verified: true });
  }

  return NextResponse.json({ error: "کد نادرست است" }, { status: 400 });
}
