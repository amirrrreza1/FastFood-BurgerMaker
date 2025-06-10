"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { supabase } from "@/Lib/supabase";

export default function ResetPassword() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      toast.error("توکن نامعتبر است");
      return;
    }
    const params = new URLSearchParams(hash.replace("#", ""));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(({ data, error }) => {
          if (error || !data.session?.user) {
            toast.error("خطا در تأیید هویت");
          } else {
            setAccessToken(access_token);
          }
        });
    } else {
      toast.error("توکن نامعتبر است");
    }
  }, []);

  const handleChangePassword = async () => {
    if (!accessToken) {
      toast.error("کاربر تأیید نشد");
      return;
    }

    if (newPassword !== repeatPassword) {
      toast.error("رمزها مطابقت ندارند");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("رمز عبور باید حداقل ۶ کاراکتر باشد");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: accessToken,
          new_password: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "خطا در تغییر رمز");

      toast.success("رمز عبور با موفقیت تغییر یافت");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "خطا در تغییر رمز");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            تغییر رمز عبور
          </h2>
          <p className="text-sm text-gray-600">
            رمز عبور جدید خود را وارد کرده و تایید کنید
          </p>
        </div>

        <input
          type="password"
          placeholder="رمز جدید"
          className="Input w-full mb-4"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="تکرار رمز جدید"
          className="Input w-full mb-4"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />

        <button
          onClick={handleChangePassword}
          disabled={loading}
          className="ConfirmBTN w-full"
        >
          {loading ? "در حال تغییر..." : "تغییر رمز"}
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
