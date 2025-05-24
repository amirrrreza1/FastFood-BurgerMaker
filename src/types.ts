export type Category = "پیتزا" | "ساندویچ" | "سوخاری" | "پیش‌غذا" | "نوشیدنی";

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  calories: number;
  description: string;
  available?: boolean;
  category: string;
  image_url: string;
  image?: string; // ← این خط لازمه برای کارت
};
