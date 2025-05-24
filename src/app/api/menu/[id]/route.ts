import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Type definition for route parameters
interface Params {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  const id = params.id;

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
