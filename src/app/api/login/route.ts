// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/Lib/firebase";
import { signToken } from "@/Lib/jwt";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    const token = await signToken({
      uid: user.uid,
      email: user.email,
    });

    const response = NextResponse.json({ message: "ورود موفق بود" });

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 2,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
