"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signupSchema, verifyCodeSchema } from "@/Lib/schemas/signup";

const SignupForm = () => {
  const [step, setStep] = useState<"form" | "verify">("form");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [resending, setResending] = useState(false);

  const router = useRouter();

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
  

  const handleResendCode = async () => {
    try {
      setResending(true);
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, displayName }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "خطا در ارسال مجدد کد");
      }

      toast.success("کد مجدداً ارسال شد");
    } catch (error: any) {
      toast.error(error.message || "خطا در ارسال مجدد کد");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="p-6 bg-[var(--color-white)] rounded-xl shadow-md w-full max-w-md mx-auto">
      {step === "form" ? (
        <form onSubmit={handleSendCode} className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-center">ثبت‌نام</h2>

          <input
            type="text"
            placeholder="نام نمایشی"
            className="p-2 border rounded"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="ایمیل"
            className="p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="رمز عبور"
            className="p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-[var(--color-secondary)] text-white py-2 rounded"
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
            className="p-2 border rounded"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded"
          >
            تأیید و ساخت اکانت
          </button>

          <button
            type="button"
            className="text-sm text-blue-600 underline mt-2"
            onClick={handleResendCode}
            disabled={resending}
          >
            {resending ? "در حال ارسال مجدد..." : "ارسال دوباره کد تأیید"}
          </button>

          <button
            type="button"
            className="text-sm text-gray-600 underline"
            onClick={() => setStep("form")}
          >
            بازگشت به مرحله قبل
          </button>
        </form>
      )}
    </div>
  );
};

export default SignupForm;
