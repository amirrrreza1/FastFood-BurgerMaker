import { supabase } from "@/Lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { getAuthPayload } from "@/Lib/auth";

export async function GET(req: NextRequest) {
  const auth = await getAuthPayload(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (auth.role !== "admin" && auth.role !== "guest") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, name , email, lastName, phoneNum ,subscription_number , created_at , is_active , display_name , role"
    )
    .order("created_at");

  if (error) {
    return NextResponse.json(
      { error: "خطا در دریافت کاربران" },
      { status: 500 }
    );
  }

  return NextResponse.json({ users: data });
}
