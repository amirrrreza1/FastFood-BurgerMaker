import { supabase } from "@/Lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase.from("faqs").select("*");

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { question, answer } = body;

  const { data, error } = await supabase
    .from("faqs")
    .insert([{ question, answer }])
    .select(); // این خط باعث می‌شود داده جدید پس از درج برگردانده شود

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 🔁 Revalidate
  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate?path=/faq`);

  return NextResponse.json(data);
}
