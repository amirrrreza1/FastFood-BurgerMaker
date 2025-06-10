import { verifyToken } from "@/Lib/jwt";
import { supabase } from "@/Lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userIdFromQuery = req.nextUrl.searchParams.get("user_id");

  let user_id =
    (userIdFromQuery as string) || req.cookies.get("user_id")?.value;

  if (!user_id) {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      const user = await verifyToken(token);
      if (!user || typeof (user as any).uid !== "string") {
        return NextResponse.json(
          { error: "توکن نامعتبر است" },
          { status: 401 }
        );
      }

      user_id = (user as any).uid;
    } catch {
      return NextResponse.json({ error: "توکن نامعتبر است" }, { status: 401 });
    }
  }

  const { data, error } = await supabase
    .from("addresses")
    .select("id, address, is_default")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "خطا در دریافت آدرس‌ها" },
      { status: 500 }
    );
  }

  return NextResponse.json({ addresses: data });
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
