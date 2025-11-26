import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Essa função resolve conflitos de classes (ex: p-4 sobrescreve p-2)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}