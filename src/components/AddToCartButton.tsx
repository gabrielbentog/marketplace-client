"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Check } from "lucide-react";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    
    // Simulação de delay para feedback visual
    // Aqui entraremos com a lógica do CartContext depois
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log("Produto adicionado:", product.name);
    setIsAdded(true);
    setIsLoading(false);

    // Reset do botão após 2 segundos
    setTimeout(() => setIsAdded(false), 2000);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="flex flex-col gap-3">
      <Button 
        size="lg" 
        className={cn(
          "w-full transition-all duration-300",
          isAdded && "bg-green-600 hover:bg-green-700"
        )}
        disabled={isOutOfStock || isLoading}
        onClick={handleAddToCart}
      >
        {isAdded ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            Adicionado!
          </>
        ) : (
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