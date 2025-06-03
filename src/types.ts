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

export type OrderUpdate = {
  status: string;
  rejection_reason?: string;
};

// types.ts
export type BurgerOptions = {
  sauces: string[]; // ترتیب مهمه
  toppings: string[]; // ترتیب مهمه
  meatCount: number;
  extraBread: boolean;
};

export type BurgerCartItem = {
  id: string; // unique
  name: "همبرگر سفارشی";
  image: "/burger-preview.jpg"; // یا تصویری از نمای کلی
  quantity: number;
  price: number;
  options: BurgerOptions;
};

// types.ts
export type Ingredient = "cheese" | "lettuce" | "tomato" | "onion" | "pickle";
export type Sauce = "ketchup" | "mayo" | "mustard" | "hot";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export type RouteContext = {
  params: {
    id: string;
  };
}
