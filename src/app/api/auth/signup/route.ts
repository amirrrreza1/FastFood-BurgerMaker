import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// تابع کمکی برای ساخت شماره اشتراک یکتا
async function generateUniqueSubscriptionNumber(): Promise<number> {
  let isUnique = false;
  let number = 0;

  while (!isUnique) {
    number = Math.floor(100000 + Math.random() * 900000); // تولید عدد 6 رقمی
    const { data, error } = await supabase
      .from("profiles")
      .select("subscription_number")
      .eq("subscription_number", number)
      .single();

    if (!data) {
      isUnique = true;
    }
  }

  return number;
}

export async function POST(req: NextRequest) {
  const { email, password, displayName } = await req.json();

  // ساخت کاربر در Supabase Auth
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      display_name: displayName,
    },
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: error?.message || "خطا در ساخت اکانت" },
      { status: 500 }
    );
  }

  // ساخت شماره اشتراک یکتا
  const subscriptionNumber = await generateUniqueSubscriptionNumber();

  // درج در جدول پروفایل
  const insertResult = await supabase.from("profiles").insert({
    id: data.user.id,
    email,
    display_name: displayName,
    role: "user",
    subscription_number: subscriptionNumber,
  });

  if (insertResult.error) {
    return NextResponse.json(
      { error: insertResult.error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "اکانت ساخته شد" });
}
