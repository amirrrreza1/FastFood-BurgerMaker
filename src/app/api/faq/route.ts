import { supabase } from "@/Lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { getAuthPayload } from "@/Lib/auth";

export async function GET() {
  const { data, error } = await supabase.from("faqs").select("*");

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const auth = await getAuthPayload(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (auth.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { question, answer } = body;

  const { data, error } = await supabase
    .from("faqs")
    .insert([{ question, answer, saved: false }])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
