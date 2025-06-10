import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/Lib/supabase";
import { RouteContext } from "@/types";


export async function PATCH(req: NextRequest, context: any) {
  const id = (context as RouteContext).params.id;

  if (!id) {
    return NextResponse.json({ error: "شناسه ارسال نشده" }, { status: 400 });
  }

  const { status } = await req.json();
  if (!status) {
    return NextResponse.json(
      { error: "وضعیت جدید مشخص نیست" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "خطا در به‌روزرسانی وضعیت سفارش" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
