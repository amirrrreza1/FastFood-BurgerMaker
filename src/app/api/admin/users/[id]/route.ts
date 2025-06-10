import { supabase } from "@/Lib/supabase";
import { RouteContext } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: any) {
  const id = (context as RouteContext).params.id;
  const body = await req.json();
  const updates: { is_active?: boolean; role?: string } = {};
  if (typeof body.is_active === "boolean") {
    updates.is_active = body.is_active;
  }
  if (typeof body.role === "string") {
    updates.role = body.role;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "هیچ فیلدی برای به‌روزرسانی ارسال نشده است" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "خطا در به‌روزرسانی اطلاعات کاربر" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
