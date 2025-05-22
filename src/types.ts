export type Category = "پیتزا" | "ساندویچ" | "سوخاری" | "پیش‌غذا" | "نوشیدنی";

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  calories: number;
  category: Category;
  image_url: string; // نام ستون در جدول Supabase
  image?: string; // لینک عمومی عکس برای نمایش
  available: boolean;
}
