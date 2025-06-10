import { z } from "zod";

export const MenuItemSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.enum(["پیتزا", "ساندویچ", "سوخاری", "پیش‌غذا", "نوشیدنی"]),
  calories: z.number().int().optional(),
  available: z.boolean(),
  image_url: z.string().url().optional(),
});
