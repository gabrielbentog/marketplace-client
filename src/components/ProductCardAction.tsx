"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Loader2, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Product } from "@/types";

export function ProductCardAction({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault(); // Evita navegar para o detalhe do produto ao clicar no botão

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setStatus('loading');
    try {
      await addToCart(product.id, 1);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('idle');
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <Button
      size="sm"
      variant={status === 'success' ? "primary" : "secondary"}
      disabled={isOutOfStock || status === 'loading'}
      className="rounded-full w-10 h-10 p-0 flex items-center justify-center transition-all duration-300"
      title="Adicionar ao carrinho"
      onClick={handleAdd}
    >
      {status === 'loading' ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : status === 'success' ? (
        <Check className="w-4 h-4" />
      ) : (
        <ShoppingCart className="w-4 h-4" />
      )}
    </Button>
  );
}
