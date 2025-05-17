// lib/menu.ts

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "پیتزا" | "ساندویچ" | "سوخاری" | "پیش‌غذا" | "نوشیدنی";
  calories: number;
  available: boolean;
};

export const menu: MenuItem[] = [
  // 🍕 پیتزا
  {
    id: 1,
    name: "پیتزا مخصوص",
    description: "پیتزا با پنیر، سوسیس، قارچ و فلفل دلمه",
    price: 150000,
    image: "",
    category: "پیتزا",
    calories: 850,
    available: true,
  },
  {
    id: 2,
    name: "پیتزا پپرونی",
    description: "پیتزا با پپرونی و پنیر زیاد",
    price: 140000,
    image: "",
    category: "پیتزا",
    calories: 800,
    available: false,
  },

  // 🥪 ساندویچ
  {
    id: 3,
    name: "ساندویچ مرغ گریل",
    description: "مرغ گریل‌شده با سس سیر و پنیر",
    price: 110000,
    image: "",
    category: "ساندویچ",
    calories: 650,
    available: true,
  },
  {
    id: 4,
    name: "ساندویچ ژامبون تنوری",
    description: "ژامبون گوشت دودی با خیارشور",
    price: 95000,
    image: "",
    category: "ساندویچ",
    calories: 620,
    available: true,
  },

  // 🍗 سوخاری
  {
    id: 5,
    name: "مرغ سوخاری 2 تکه",
    description: "دو تکه ران مرغ با پودر تند",
    price: 98000,
    image: "",
    category: "سوخاری",
    calories: 720,
    available: true,
  },
  {
    id: 6,
    name: "بال سوخاری تند",
    description: "۶ عدد بال سوخاری با طعم دودی",
    price: 85000,
    image: "",
    category: "سوخاری",
    calories: 600,
    available: false,
  },

  // 🥗 پیش‌غذا
  {
    id: 7,
    name: "سیب‌زمینی سرخ‌کرده",
    description: "با پنیر و سس مخصوص",
    price: 50000,
    image: "",
    category: "پیش‌غذا",
    calories: 450,
    available: true,
  },
  {
    id: 8,
    name: "سالاد کلم",
    description: "سالاد کلم سفید و سس مخصوص",
    price: 35000,
    image: "",
    category: "پیش‌غذا",
    calories: 200,
    available: true,
  },

  // 🥤 نوشیدنی
  {
    id: 9,
    name: "نوشابه خانواده",
    description: "نوشابه کوکاکولا 1.5 لیتری",
    price: 25000,
    image: "",
    category: "نوشیدنی",
    calories: 180,
    available: true,
  },
  {
    id: 10,
    name: "دلستر لیمویی",
    description: "دلستر قوطی با طعم لیمو",
    price: 20000,
    image: "",
    category: "نوشیدنی",
    calories: 170,
    available: true,
  },
];
