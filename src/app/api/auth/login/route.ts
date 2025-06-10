import { signToken } from "@/Lib/jwt";
import { supabase } from "@/Lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user || !data.session?.access_token) {
    return NextResponse.json(
      { error: error?.message || "ورود ناموفق" },
      { status: 401 }
    );
  }

  const supabaseAccessToken = data.session.access_token;
  const user = data.user;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json(
      { error: "مشکلی در دریافت نقش کاربر پیش آمد" },
      { status: 500 }
    );
  }

  const token = await signToken({
    uid: user.id,
    email: user.email!,
    role: profile.role,
    is_active: profile.is_active,
  });

  const response = NextResponse.json({ message: "ورود موفق بود" });

  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 2,
  });

  response.cookies.set("sb-access-token", supabaseAccessToken, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 2,
  });

  return response;
}
