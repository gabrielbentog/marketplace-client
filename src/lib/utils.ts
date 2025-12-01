import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: string | number | undefined | null): string {
  if (!value) return "R$ 0,00";
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : Number(value);
  if (isNaN(numericValue)) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(numericValue);
}

// --- NOVO: Helper de Imagem ---
export function getImageUrl(url: string | undefined | null): string {
  // 1. Fallback se não tiver imagem
  if (!url) return "https://placehold.co/600x400?text=Sem+Imagem";

  // 2. Se já for absoluta (ex: https://s3...), retorna direto
  if (url.startsWith("http") || url.startsWith("https")) {
    return url;
  }

  // 3. Se for relativa (/rails/...), concatena com a URL da API
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, ""); // Remove barra final se tiver
  const path = url.startsWith("/") ? url : `/${url}`; // Garante barra inicial

  return `${baseUrl}${path}`;
}
