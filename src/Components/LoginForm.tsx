"use client";

import { loginSchema } from "@/Lib/schemas/login";
import { LoginFormProps } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";



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
      const res = await fetch("/api/auth/login", {
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

      router.push(redirect);
    } catch (error: any) {
      toast.error(error.message || "خطایی رخ داد");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            ایمیل
          </label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            className="Input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            رمز عبور
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="Input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="ConfirmBTN w-full"
        >
          ورود
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
