import { supabase } from "@/Lib/supabase";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const id = context.params.id;
  const { error } = await supabase.from("faqs").delete().eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  const id = context.params.id;
  const { question, answer, saved } = await req.json();

  const { error } = await supabase
    .from("faqs")
    .update({ question, answer, saved })
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
