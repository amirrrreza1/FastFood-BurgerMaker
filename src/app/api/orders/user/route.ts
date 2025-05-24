import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/Lib/jwt";
import { supabase } from "@/Lib/supabase";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // اگر TypeScript گیر نده

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await verifyToken(token);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.uid)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "خطا در دریافت سفارش‌ها" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "توکن نامعتبر است" }, { status: 401 });
  }
}
