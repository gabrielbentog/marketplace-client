import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Essa função resolve conflitos de classes (ex: p-4 sobrescreve p-2)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: string | number | undefined | null): string {
  if (!value) return "R$ 0,00";
  
  // Converte para string, troca vírgula por ponto (caso venha errado) e faz o parse
  const numericValue = typeof value === 'string' 
    ? parseFloat(value.replace(',', '.')) 
    : Number(value);

  if (isNaN(numericValue)) return "R$ 0,00";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericValue);
}