import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function generateUniqueSubscriptionNumber(): Promise<number> {
  let isUnique = false;
  let number = 0;

  while (!isUnique) {
    number = Math.floor(100000 + Math.random() * 900000);
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
  const trimesDisplayName = displayName.trim();
  const usernameNormalized = trimesDisplayName.toLowerCase();
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

  const subscriptionNumber = await generateUniqueSubscriptionNumber();

  const insertResult = await supabase.from("profiles").insert({
    id: data.user.id,
    email,
    display_name: displayName,
    username_normalized: usernameNormalized,
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
