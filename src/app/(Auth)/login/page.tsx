"use client";

import LoginForm from "@/Components/LoginForm/LoginForm";
import SignupForm from "@/Components/SignupForm/SignupForm";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[95%] h-fit max-w-[500px]">
        {isSignup ? <SignupForm /> : <LoginForm />}
        <div className="text-center mt-4">
          <button
            className="text-blue-600 underline"
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
