// app/api/menu/route.ts
import { menu } from "@/Lib/menu";
import { NextResponse } from "next/server";



export async function GET() {
  return NextResponse.json(menu);
}
