"use client";

import LoginForm from "@/Components/LoginForm";
import SignupForm from "@/Components/SignupForm";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="w-full h-screen flex justify-center items-center LoginBackGround">
      <div className="w-[95%] h-fit max-w-[500px] flex juce' items-center flex-col gap-4">
        {isSignup ? <SignupForm /> : <LoginForm />}
        <div>
          <button
            className="text-[var(--color-MainGreen)] font-semibold text-sm cursor-pointer"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "حساب دارید؟ وارد شوید" : "حساب ندارید؟ ثبت‌نام کنید"}
          </button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default LoginPage;
