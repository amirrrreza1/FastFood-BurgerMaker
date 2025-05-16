// app/api/send-verification-code/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/Lib/firebase";
import { doc, setDoc } from "firebase/firestore";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 رقمی
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "ایمیل الزامی است" }, { status: 400 });
  }

  const code = generateCode();

  try {
    // ذخیره کد در Firestore (با انقضا 10 دقیقه)
    await setDoc(doc(db, "verifications", email), {
      code,
      createdAt: Date.now(),
    });

    // ارسال ایمیل با Resend
    await resend.emails.send({
      from: "Auth <onboarding@resend.dev>",
      to: [email],
      subject: "کد تأیید ثبت‌نام",
      html: `<p>کد تایید شما: <strong>${code}</strong></p>`,
    });

    return NextResponse.json({ message: "کد ارسال شد" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
