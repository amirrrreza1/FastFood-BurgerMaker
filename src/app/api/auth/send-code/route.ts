import { NextRequest, NextResponse } from "next/server";
import { codeStore } from "@/Lib/codeStore";

export async function POST(req: NextRequest) {
  const { email, displayName } = await req.json();

  const Vcode = Math.floor(100000 + Math.random() * 900000).toString();
  codeStore.set(email, Vcode);

  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin: "http://localhost",
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_API_KEY,
        template_params: {
          email: email,
          name: displayName,
          code: Vcode,
        },
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`خطا در ارسال ایمیل: ${errorText}`);
    }

    return NextResponse.json({ message: "کد ارسال شد" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
