import { z } from "zod";

export const signupSchema = z.object({
  displayName: z
    .string()
    .min(4, "نام باید حداقل ۲ کاراکتر باشد")
    .max(20, "نام نمی‌تواند بیش از ۲۰ کاراکتر باشد"),
  email: z.string().email("ایمیل نامعتبر است"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

export const verifyCodeSchema = z.object({
  email: z.string().email("ایمیل نامعتبر است"),
  code: z
    .string()
    .length(6, "کد باید ۶ رقمی باشد")
    .regex(/^\d+$/, "کد فقط باید عدد باشد"),
});
