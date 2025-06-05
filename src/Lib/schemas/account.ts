import { z } from "zod";
const persianRegex = /^[\u0600-\u06FF\s]+$/;
const persianWithNumbersRegex = /^[\u0600-\u06FF0-9\s]+$/;


export const profileSchema = z.object({
  firstName: z
    .string()
    .min(4, "نام باید حداقل ۴ حرف باشد")
    .regex(persianRegex, "نام خانوادگی باید فارسی باشد"),

  lastName: z
    .string()
    .min(4, "نام خانوادگی باید حداقل ۴ حرف باشد")
    .regex(persianRegex, "نام خانوادگی باید فارسی باشد"),

  phone: z
    .string()
    .regex(
      /^09\d{9}$/,
      "شماره تلفن نامعتبر است (باید با 09 شروع شود و 11 رقم باشد)"
    ),
});


export const detailedAddressSchema = z.object({
  street: z
    .string()
    .min(2, "نام خیابان خیلی کوتاه است")
    .regex(persianWithNumbersRegex, "نام خیابان باید فارسی باشد"),
  alley: z
    .string()
    .min(2, "نام کوچه خیلی کوتاه است")
    .regex(persianWithNumbersRegex, "نام کوچه باید فارسی باشد"),
  plaque: z
    .string()
    .min(1, "پلاک الزامی است")
    .regex(persianWithNumbersRegex, "نام پلاک باید فارسی باشد"),
  unit: z
    .string()
    .min(1, "واحد الزامی است")
    .regex(persianWithNumbersRegex, "نام واحد باید فارسی باشد"),
});
