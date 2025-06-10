import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { RouteContext } from "@/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);


export async function GET(req: NextRequest, context: any) {
  const id = (context as RouteContext).params.id;

  if (!id) {
    return NextResponse.json({ error: "شناسه ارسال نشده" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "آیتم پیدا نشد" }, { status: 404 });
  }

  return NextResponse.json(data);
}
