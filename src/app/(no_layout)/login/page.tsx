"use client";

import LoginForm from "@/Components/LoginForm";
import SignupForm from "@/Components/SignupForm";
import Link from "next/link";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[var(--color-gray)]">
      <div className="w-[95%] h-fit max-w-[500px] flex juce' items-center flex-col gap-4">
        {isSignup ? <SignupForm /> : <LoginForm />}
        <div>
          <button
            className="font-semibold text-sm cursor-pointer"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "حساب دارید؟ وارد شوید" : "حساب ندارید؟ ثبت‌نام کنید"}
          </button>
        </div>
        <Link href={"/"}>صفحه اصلی</Link>
      </div>
    </div>
  );
};

export default LoginPage;
