// app/api/admin/users/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const { data, error } = await supabase
    .from("profiles")
    .select("id, name , email, lastName, phoneNum,subscription_number, created_at, is_active , display_name")   
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "خطا در دریافت کاربران" },
      { status: 500 }
    );
  }

  return NextResponse.json({ users: data });
}
