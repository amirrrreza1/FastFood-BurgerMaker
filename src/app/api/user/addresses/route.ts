import { verifyToken } from "@/Lib/jwt";
import { supabase } from "@/Lib/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const user = await verifyToken(token as string);
  const user_id = user.uid;

  const { data, error } = await supabase
    .from("addresses")
    .select("id, address")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "خطا در دریافت آدرس‌ها" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const user = await verifyToken(token as string);
  const user_id = user.uid;

  const body = await req.json();
  const { address } = body;

  if (!address) {
    return NextResponse.json(
      { error: "تمام فیلدها الزامی هستند" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      address,
      user_id: user_id,
    })
    .select("id, address")
    .single();

  if (error) {
    return NextResponse.json({ error: "خطا در ثبت آدرس" }, { status: 500 });
  }

  return NextResponse.json(data);
}
