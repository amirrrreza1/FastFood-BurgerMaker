import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // فقط در سرور استفاده شود!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { access_token, new_password } = body;

    if (!access_token || !new_password) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    const { data: userData, error: getUserError } =
      await supabaseAdmin.auth.getUser(access_token);

    if (getUserError || !userData?.user?.id) {
      return NextResponse.json(
        { error: "کاربر یافت نشد یا توکن نامعتبر است" },
        { status: 401 }
      );
    }

    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(userData.user.id, {
        password: new_password,
      });

    if (updateError) {
      return NextResponse.json(
        { error: "خطا در تغییر رمز عبور" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "خطای ناشناخته" },
      { status: 500 }
    );
  }
}
