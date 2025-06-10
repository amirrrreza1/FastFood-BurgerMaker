import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { access_token, new_password } = await request.json();

    if (!access_token || !new_password) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // گرفتن اطلاعات کاربر با access_token
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(access_token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid access token" },
        { status: 401 }
      );
    }

    const user_id = user.id;

    // تغییر رمز عبور کاربر
    const { error } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
      password: new_password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Password updated" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
