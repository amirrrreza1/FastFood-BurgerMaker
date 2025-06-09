// /app/api/admin/custom-burgers/route.ts
import { supabase } from "@/Lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {

  const { data, error } = await supabase
    .from("custom_burgers")
    .select("id, name, layers, image_url");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const normalized = data.map((burger) => ({
    ...burger,
    layers:
      typeof burger.layers === "string"
        ? JSON.parse(burger.layers)
        : burger.layers,
  }));

  return NextResponse.json(normalized);
}
