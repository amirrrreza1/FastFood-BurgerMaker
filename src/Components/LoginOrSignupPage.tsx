"use client";

import LoginForm from "@/Components/LoginForm";
import SignupForm from "@/Components/SignupForm";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {isSignup ? "ثبت‌نام در سایت" : "ورود به حساب"}
          </div>
          <p className="text-sm text-gray-600">
            {isSignup
              ? "برای ایجاد حساب جدید فرم زیر را تکمیل کنید"
              : "لطفاً اطلاعات حساب خود را وارد کنید"}
          </p>
        </div>

        {/* فرم‌ها */}
        {isSignup ? <SignupForm /> : <LoginForm redirect={redirect} />}
        <div className="text-center mt-4">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-sm font-medium text-indigo-700 hover:underline transition cursor-pointer"
          >
            {isSignup ? "حساب دارید؟ وارد شوید" : "حساب ندارید؟ ثبت‌نام کنید"}
          </button>
        </div>
        {/* فراموشی رمز عبور */}
        {!isSignup && (
          <div className="text-center mt-1">
            <button
              onClick={() => router.push("/forgot-password")}
              className="text-sm text-blue-600 hover:underline transition cursor-pointer"
            >
              رمز عبور را فراموش کرده‌اید؟
            </button>
          </div>
        )}

        {/* دکمه تغییر حالت */}

        {/* بازگشت به صفحه اصلی */}
        <div className="text-center mt-1">
          <Link
            href="/"
            className="text-xs text-gray-500 hover:underline transition"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
