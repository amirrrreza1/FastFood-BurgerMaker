"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          displayName,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "ثبت‌نام با خطا مواجه شد");
      }

      toast.success(
        "ثبت‌نام با موفقیت انجام شد. لطفاً ایمیل خود را تأیید کنید."
      );
      router.push("/verify-email");
    } catch (error: any) {
      toast.error(error.message || "خطا در ثبت‌نام");
    }
  };

  return (
    <div className="p-6 bg-[var(--color-white)] rounded-xl shadow-md w-full max-w-md">
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
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
          ثبت‌نام
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
