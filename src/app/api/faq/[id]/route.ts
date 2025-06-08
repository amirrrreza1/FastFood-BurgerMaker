import { supabase } from "@/Lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await supabase.from("faqs").delete().eq("id", params.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate?path=/faq`);
  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { question, answer } = await req.json();
  const { error } = await supabase
    .from("faqs")
    .update({ question, answer })
    .eq("id", params.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate?path=/faq`);
  return NextResponse.json({ success: true });
}
