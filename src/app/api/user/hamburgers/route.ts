import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/Lib/jwt";
import { supabase } from "@/Lib/supabase";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const user = await verifyToken(token as string);
  const user_id = user.uid;

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
