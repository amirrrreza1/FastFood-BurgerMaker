import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/Lib/jwt";
import { supabase } from "@/Lib/supabase";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await verifyToken(token);
    const { items, total, address, note, payment_method, user_id, order_type } =
      await req.json();

    const targetUserId = user_id || user.uid;

    // تنظیم وضعیت سفارش بر اساس نوع آن
    const status = order_type === "online" ? "pending" : "preparing";

    const { error } = await supabase.from("orders").insert([
      {
        user_id: targetUserId,
        status,
        total_price: total,
        items,
        address,
        note,
        payment_method,
        order_type,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "توکن نامعتبر است" }, { status: 401 });
  }
}
