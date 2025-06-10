"use client"


import { loginSchema } from "@/Lib/schemas/login";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface LoginFormProps {
  redirect: string;
}

const LoginForm = ({ redirect }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      toast.error(
        "ورود نامعتبر است: " +
          result.error.errors.map((e) => e.message).join("، ")
      );
      return;
    }

    try {
      const res = await fetch("api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "ورود ناموفق بود");
      }

      // موفقیت‌آمیز: ریدایرکت به مسیر اصلی
      router.push(redirect);
    } catch (error: any) {
      toast.error(error.message || "خطایی رخ داد");
    }
  };

  return (
    <div className="p-6 bg-[var(--color-white)] rounded-xl shadow-md w-full max-w-md">
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center">ورود</h2>
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
        <button type="submit" className="LoginFormBtn">
          ورود
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
