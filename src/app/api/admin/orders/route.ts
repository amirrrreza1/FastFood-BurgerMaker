import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/Lib/supabase";
import { OrderUpdate } from "@/types";


export async function GET() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "خطا در دریافت سفارش‌ها" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const { orderId, status, cancelReason } = await req.json();

  const updates: OrderUpdate = { status };
  if (status === "cancelled") {
    updates.rejection_reason = cancelReason;
  }
  const { error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", orderId);

  if (error) {
    return NextResponse.json(
      { error: "خطا در بروزرسانی سفارش" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
