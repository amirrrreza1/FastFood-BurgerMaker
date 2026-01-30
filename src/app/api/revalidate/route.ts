import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getAuthPayload } from "@/Lib/auth";

export async function POST(req: NextRequest) {
  const auth = await getAuthPayload(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (auth.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    revalidatePath("/faq");
    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json({ error: "خطا در revalidate" }, { status: 500 });
  }
}
