import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { codeStore } from "@/Lib/codeStore"; // مسیر رو بر اساس ساختار پروژه تنظیم کن

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  const { email, displayName } = await req.json();

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codeStore.set(email, code);

  try {
    await resend.emails.send({
      from: "Auth <onboarding@resend.dev>",
      to: email,
      subject: "کد تأیید ایمیل",
      html: `<p>سلام ${displayName} 👋</p><p>کد تأیید شما: <strong>${code}</strong></p>`,
    });

    return NextResponse.json({ message: "کد ارسال شد" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
