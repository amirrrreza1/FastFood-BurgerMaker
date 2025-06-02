import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(4, "نام باید حداقل ۴ حرف باشد"),
  lastName: z.string().min(4, "نام خانوادگی باید حداقل ۴ حرف باشد"),
  phone: z
    .string()
    .regex(
      /^09\d{9}$/,
      "شماره تلفن نامعتبر است (باید با 09 شروع شود و 11 رقم باشد)"
    ),
  birthDate: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const now = new Date();
        const input = new Date(date);
        const hundredYearsAgo = new Date();
        hundredYearsAgo.setFullYear(now.getFullYear() - 100);
        return input <= now && input >= hundredYearsAgo;
      },
      { message: "تاریخ تولد نامعتبر است" }
    ),
});

export const addressSchema = z.object({
  address: z.string().min(10, "آدرس باید حداقل ۱۰ حرف باشد"),
});

export const detailedAddressSchema = z.object({
  street: z.string().min(2, "نام خیابان خیلی کوتاه است"),
  alley: z.string().min(2, "نام کوچه خیلی کوتاه است"),
  plaque: z.string().min(1, "پلاک الزامی است"),
  unit: z.string().min(1, "واحد الزامی است"),
});
