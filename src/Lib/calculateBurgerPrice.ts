// utils/calculateBurgerPrice.ts
import { BurgerOptions } from "@/types";

export function calculateBurgerPrice(options: BurgerOptions): number {
  const basePrice = 60000;

  const sauceCount = Array.isArray(options.sauces) ? options.sauces.length : 0;
  const toppingCount = Array.isArray(options.toppings)
    ? options.toppings.length
    : 0;
  const meatCount =
    typeof options.meatCount === "number" ? options.meatCount : 0;
  const extraBread = !!options.extraBread;

  const saucePrice = 5000 * sauceCount;
  const toppingPrice = 7000 * toppingCount;
  const meatPrice = 30000 * meatCount;
  const breadPrice = extraBread ? 10000 : 0;

  return basePrice + saucePrice + toppingPrice + meatPrice + breadPrice;
}
