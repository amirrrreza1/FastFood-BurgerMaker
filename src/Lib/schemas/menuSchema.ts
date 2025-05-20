import { z } from "zod";

export const MenuItemSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  price: z.number().positive(),
  category: z.enum(["پیتزا", "ساندویچ", "سوخاری", "پیش‌غذا", "نوشیدنی"]),
  calories: z.number().positive(),
  available: z.boolean(),
});
