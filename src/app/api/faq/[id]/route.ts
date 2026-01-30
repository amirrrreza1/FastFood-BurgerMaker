import { supabase } from "@/Lib/supabase";
import { RouteContext } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { getAuthPayload } from "@/Lib/auth";


export async function DELETE(req: NextRequest, context: any) {
  const auth = await getAuthPayload(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (auth.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const id = (context as RouteContext).params.id;
  const { error } = await supabase.from("faqs").delete().eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, context: any) {
  const auth = await getAuthPayload(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (auth.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const id = (context as RouteContext).params.id;
  const { question, answer, saved } = await req.json();

  const { error } = await supabase
    .from("faqs")
    .update({ question, answer, saved })
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
