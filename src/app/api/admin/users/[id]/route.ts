import { supabase } from "@/Lib/supabase";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function POST(req: NextRequest, context: any) {
  const id = (context as RouteContext).params.id;
  const { is_active } = await req.json();

  const { error } = await supabase
    .from("profiles")
    .update({ is_active })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "خطا در به‌روزرسانی وضعیت" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
