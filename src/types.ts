// types.ts

export type Category = "پیتزا" | "ساندویچ" | "سوخاری" | "پیش‌غذا" | "نوشیدنی";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  category: Category;
  img_url: string;
  available: boolean;
  created_at?: string;
}
