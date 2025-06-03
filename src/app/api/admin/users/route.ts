import { supabase } from "@/Lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, name , email, lastName, phoneNum ,subscription_number , created_at , is_active , display_name"
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
