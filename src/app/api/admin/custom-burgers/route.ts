import { supabase } from "@/Lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { getAuthPayload } from "@/Lib/auth";

export async function GET(req: NextRequest) {
  const auth = await getAuthPayload(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (auth.role !== "admin" && auth.role !== "guest") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
