import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNrs(amount: unknown, fractionDigits: number = 2) {
  const numericAmount =
    typeof amount === "string" ? Number(amount) : (amount as number);
  const safeAmount = Number.isFinite(numericAmount) ? numericAmount : 0;
  return `Nrs. ${safeAmount.toFixed(fractionDigits)}`;
}
