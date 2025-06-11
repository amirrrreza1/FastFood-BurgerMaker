"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { signupSchema, verifyCodeSchema } from "@/Lib/schemas/signup";

const SignupForm = () => {
  const [step, setStep] = useState<"form" | "verify">("form");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<
    "checking" | "available" | "taken" | null
  >(null);

  const handleSendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const validation = signupSchema.safeParse({ email, password, displayName });
    if (!validation.success) {
      toast.error(validation.error.errors.map((err) => err.message).join("، "));
      return;
    }

    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, displayName }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "خطا در ارسال کد");
      }

      toast.success("کد تأیید به ایمیل شما ارسال شد");
      setStep("verify");
    } catch (error: any) {
      toast.error(error.message || "خطا در ارسال کد");
    }
  };

  const handleVerifyAndSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = verifyCodeSchema.safeParse({ email, code });
    if (!validation.success) {
      toast.error(validation.error.errors.map((err) => err.message).join("، "));
      return;
    }

    try {
      const verifyRes = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json();
        throw new Error(errorData.error || "کد تأیید نادرست است");
      }

      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName }),
      });

      if (!signupRes.ok) {
        const errorData = await signupRes.json();
        throw new Error(errorData.error || "ثبت‌نام ناموفق بود");
      }

      toast.success("ثبت‌نام با موفقیت انجام شد");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "خطا در ثبت‌نام");
    }
  };

  useEffect(() => {
    const trimmed = displayName.trim();
    const normalized = trimmed.toLowerCase(); // 👈 یکسان‌سازی

    if (!normalized) {
      setUsernameStatus(null);
      return;
    }

    const delay = setTimeout(async () => {
      setUsernameStatus("checking");

      try {
        const res = await fetch("/api/auth/check-username", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ displayName: normalized }),
        });

        const data = await res.json();
        setUsernameStatus(data.exists ? "taken" : "available");
      } catch {
        setUsernameStatus(null);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [displayName]);

  return (
    <div className="w-full max-w-md mx-auto">
      {step === "form" ? (
        <form onSubmit={handleSendCode} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="نام کاربری"
            className="Input"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />

          {usernameStatus === "checking" && (
            <p className="text-sm text-gray-500">در حال بررسی...</p>
          )}
          {usernameStatus === "available" && (
            <p className="text-sm text-green-600">
              این نام کاربری قابل استفاده است
            </p>
          )}
          {usernameStatus === "taken" && (
            <p className="text-sm text-red-600">
              این نام کاربری قبلاً استفاده شده است
            </p>
          )}

          <input
            type="email"
            placeholder="ایمیل"
            className="Input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="رمز عبور"
            className="Input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="ConfirmBTN w-full"
            disabled={
              usernameStatus === "taken" || usernameStatus === "checking"
            }
          >
            ارسال کد تأیید
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyAndSignup} className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-center">تأیید ایمیل</h2>

          <input
            type="text"
            placeholder="کد ارسال‌شده به ایمیل"
            className="Input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <button type="submit" className="LoginFormBtn">
            تأیید و ساخت اکانت
          </button>
        </form>
      )}
    </div>
  );
};

export default SignupForm;
