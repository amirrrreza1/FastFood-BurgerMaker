import { supabase } from "@/Lib/supabase";
import { RouteContext } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: any) {
  const id = (context as RouteContext).params.id;

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, context: any) {
  const id = (context as RouteContext).params.id;
  const { title, content, image_url } = await req.json();

  const { error } = await supabase
    .from("blogs")
    .update({ title, content, image_url, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "ویرایش با موفقیت انجام شد" });
}

export async function DELETE(req: NextRequest, context: any) {
  const id = (context as RouteContext).params.id;
  const { error } = await supabase.from("blogs").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "حذف با موفقیت انجام شد" });
}
