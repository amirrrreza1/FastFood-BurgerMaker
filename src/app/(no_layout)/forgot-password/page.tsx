"use client";

import { useState } from "react";
import { supabase } from "@/Lib/supabase";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!email) {
      toast.error("لطفا ایمیل خود را وارد کنید");
      return;
    }

    const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://www.amirfast.ir/reset-password",
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("لینک بازیابی رمز به ایمیل شما ارسال شد");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            بازیابی رمز عبور
          </h2>
          <p className="text-sm text-gray-600">
            ایمیل خود را وارد کنید تا لینک بازیابی برایتان ارسال شود
          </p>
        </div>

        <input
          type="email"
          placeholder="ایمیل"
          className="Input w-full mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className="ConfirmBTN w-full"
        >
          {loading ? "در حال ارسال..." : "ارسال لینک بازیابی"}
        </button>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-blue-600 hover:underline transition"
          >
            بازگشت به صفحه ورود
          </button>
        </div>
      </div>
    </div>
  );
}
