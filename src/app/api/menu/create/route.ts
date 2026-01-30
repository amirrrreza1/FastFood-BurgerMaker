import { z } from "zod";
import { supabase } from "@/Lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { MenuItemSchema } from "@/Lib/schemas/menuSchema";
import { getAuthPayload } from "@/Lib/auth";

export async function POST(req: NextRequest) {
  const auth = await getAuthPayload(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (auth.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parse = MenuItemSchema.safeParse(body);

  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten() }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("menu_items")
    .insert(parse.data)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
