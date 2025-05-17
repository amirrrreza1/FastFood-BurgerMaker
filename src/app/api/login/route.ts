import { signToken } from "@/Lib/jwt";
import { supabase } from "@/Lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: error?.message || "ورود ناموفق" },
      { status: 401 }
    );
  }

  const user = data.user;

  if (!user.email_confirmed_at) {
    return NextResponse.json(
      { error: "ایمیل شما هنوز تأیید نشده است" },
      { status: 403 }
    );
  }

  const token = await signToken({
    uid: user.id,
    email: user.email,
  });

  const response = NextResponse.json({ message: "ورود موفق بود" });

  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 2, // 2 ساعت
    secure: process.env.NODE_ENV === "production", // فقط در پروکشن
  });

  return response;
}
