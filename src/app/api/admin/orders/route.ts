import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/Lib/supabase";
import { OrderUpdate } from "@/types";
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
    .from("orders")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "خطا در دریافت سفارش‌ها" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const auth = await getAuthPayload(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (auth.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
