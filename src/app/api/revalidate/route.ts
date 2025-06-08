import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    revalidatePath("/faq");
    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json({ error: "خطا در revalidate" }, { status: 500 });
  }
}
