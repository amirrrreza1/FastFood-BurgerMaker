// app/api/verify-code/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/Lib/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();

  if (!email || !code) {
    return NextResponse.json(
      { error: "ایمیل و کد الزامی هستند" },
      { status: 400 }
    );
  }

  const docRef = doc(db, "verifications", email);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return NextResponse.json(
      { error: "کدی برای این ایمیل یافت نشد" },
      { status: 404 }
    );
  }

  const data = snapshot.data();
  const isExpired = Date.now() - data.createdAt > 10 * 60 * 1000; // 10 دقیقه

  if (isExpired) {
    await deleteDoc(docRef);
    return NextResponse.json({ error: "کد منقضی شده است" }, { status: 410 });
  }

  if (data.code !== code) {
    return NextResponse.json({ error: "کد نادرست است" }, { status: 401 });
  }

  // حذف کد بعد از تأیید موفق
  await deleteDoc(docRef);

  return NextResponse.json({ message: "تأیید موفق بود" });
}
