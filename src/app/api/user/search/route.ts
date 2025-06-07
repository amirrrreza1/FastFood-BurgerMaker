import { supabase } from "@/Lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length === 0) {
    return NextResponse.json({ users: [] });
  }

  const orFilter = [
    `name.ilike.%${query}%`,
    `lastName.ilike.%${query}%`,
    `phoneNum.ilike.%${query}%`,
    `email.ilike.%${query}%`,
    `subscription_number.ilike.%${query}%`,
  ].join(",");

  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, lastName, phoneNum, email, subscription_number")
    .or(orFilter)
    .limit(10);

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ users: [] }, { status: 500 });
  }

  return NextResponse.json({ users: data });
}
