"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

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

      toast.success("ورود موفقیت‌آمیز بود!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "خطایی رخ داد");
    }
  };

  return (
    <div className="p-6 bg-[var(--color-white)] rounded-xl shadow-md w-full max-w-md">
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold">ورود</h2>
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
          className="bg-[var(--color-secondary)] text-[var(--color-white)] py-2 rounded"
        >
          ورود
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
