// utils/buildBurgerItem.ts
import { BurgerCartItem, BurgerOptions } from "@/types";
import { v4 as uuid } from "uuid";
import { calculateBurgerPrice } from "./calculateBurgerPrice";

export function buildBurgerItem(options: BurgerOptions): BurgerCartItem {
  return {
    id: uuid(),
    name: "همبرگر سفارشی",
    image: "/burger-preview.jpg",
    quantity: 1,
    price: calculateBurgerPrice(options),
    options,
  };
}
