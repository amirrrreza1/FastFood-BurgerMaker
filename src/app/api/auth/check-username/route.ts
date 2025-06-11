import { supabase } from "@/Lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { displayName } = await req.json();
  const trimmedName = (displayName || "").trim();
  const normalized = trimmedName.toLowerCase();

  if (!normalized) {
    return NextResponse.json(
      { error: "نام کاربری الزامی است" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username_normalized", normalized)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json(
      { error: "خطا در بررسی نام کاربری" },
      { status: 500 }
    );
  }

  return NextResponse.json({ exists: !!data });
}
