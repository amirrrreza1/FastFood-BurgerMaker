export type MenuItem = {
  id: string;
  name: string;
  price: number;
  calories: number;
  description: string;
  available: boolean;
  category: string;
  image_url: string;
};

export type OrderUpdate = {
  status: string;
  rejection_reason?: string;
};

export type BurgerOptions = {
  sauces: string[];
  toppings: string[];
  meatCount: number;
  extraBread: boolean;
};

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
};

export type Address = {
  id: string;
  address: string;
  is_default: boolean;
};

export type CustomBurger = {
  id: string;
  name: string;
  total_price: number;
  calories: number;
  description: string;
  layers: string[] | string;
  image_url?: string;
  user_id: string;
  options: BurgerOptions;
  created_at: string;
  total_calories: number;
};

export type FAQ = {
  id: number;
  question: string;
  answer: string;
  saved?: boolean;
};

export type ModalState = {
  isOpen: boolean;
  mode: "add" | "edit";
  faqToEdit?: FAQ | null;
};

export type Props = {
  isOpen: boolean;
  mode: "add" | "edit";
  question: string;
  answer: string;
  loading: boolean;
  onClose: () => void;
  onChangeQuestion: (value: string) => void;
  onChangeAnswer: (value: string) => void;
  onSave: () => void;
};

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  status: string;
  created_at: string;
  order_type: "online" | "in_person" | "phone";
  items: OrderItem[];
  note?: string;
  user_id: string;
  rejection_reason?: string;
}

export interface UserProfile {
  id: string;
  email: string | null;
  name: string | null;
  lastName: string | null;
  phoneNum: number | null;
  role: string;
  subscription_number: number | null;
  created_at: string;
  is_active?: boolean;
  display_name: string;
  username_normalized: string;
}

export interface LoadingSpinnerProps {
  text?: string;
  fullScreen?: boolean;
}

export interface LoginFormProps {
  redirect: string;
}