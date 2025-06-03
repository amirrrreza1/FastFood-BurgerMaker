import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/Lib/jwt";
import { supabase } from "@/Lib/supabase";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // ⛔ توکن وجود ندارد
  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized - Token missing" },
      { status: 401 }
    );
  }

  let user;

  try {
    user = await verifyToken(token);
  } catch (err) {
    // ⛔ توکن نامعتبر
    return NextResponse.json(
      { error: "Unauthorized - Invalid token" },
      { status: 401 }
    );
  }

  const user_id = user.uid;

  const { data: userData, error: userError } = await supabase
    .from("profiles")
    .select("is_active")
    .eq("id", user_id)
    .single();

  if (userError || !userData) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }


  // ✅ دریافت برگرهای سفارشی
  const { data: burgers, error } = await supabase
    .from("custom_burgers")
    .select("id, name, image_url , total_price")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ burgers });
}
