"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext"; // Conexão com o carrinho
import { useAuth } from "@/contexts/AuthContext"; // Conexão com auth
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  // Hooks para acessar o estado global
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    // 1. Redireciona se não estiver logado
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      // 2. Chama a ação real do Contexto
      // Isso vai disparar o POST para /api/cart/items e atualizar a lista
      await addToCart(product.id, 1);

      // 3. Feedback visual de sucesso
      setIsAdded(true);

      // Reseta o estado do botão após 2 segundos
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      // O toast de erro já é exibido pelo CartContext, então só paramos o loading
      console.error("Falha ao adicionar ao carrinho", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="flex flex-col gap-3">
      <Button
        size="lg"
        className={cn(
          "w-full transition-all duration-300",
          isAdded && "bg-green-600 hover:bg-green-700" // Cor verde no sucesso
        )}
        disabled={isOutOfStock || isLoading}
        onClick={handleAddToCart}
      >
        {/* Estado de Carregamento */}
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Adicionando...
          </>
        ) : isAdded ? (
          /* Estado de Sucesso */
          <>
            <Check className="mr-2 h-5 w-5" />
            Adicionado!
          </>
        ) : (
          /* Estado Padrão */
          <>
            <ShoppingCart className="mr-2 h-5 w-5" />
            {isOutOfStock ? "Esgotado" : "Adicionar ao Carrinho"}
          </>
        )}
      </Button>

      {isOutOfStock && (
        <p className="text-sm text-red-500 text-center font-medium">
          Este produto não está disponível no momento.
        </p>
      )}
    </div>
  );
}
