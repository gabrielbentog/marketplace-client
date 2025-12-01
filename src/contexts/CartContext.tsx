"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Cart } from "@/types";
import { CartService } from "@/services/cart";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  cartTotal: string;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  const refreshCart = async () => {
    setIsLoading(true);
    try {
      const data = await CartService.getCart();
      console.log("Dados do Carrinho recebidos:", data); // <--- DEBUG: Veja se aparece no console
      setCart(data);
    } catch (error) {
      console.error("Erro ao carregar carrinho", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      await CartService.addItem(productId, quantity);
      await refreshCart();
      toast.success("Adicionado ao carrinho");
    } catch (error) {
      toast.error("Erro ao adicionar");
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      // Otimista
      if (cart) {
        setCart({
          ...cart,
          cartItems: cart.cartItems.filter((item) => item.id !== itemId),
        });
      }
      await CartService.removeItem(itemId);
      await refreshCart();
    } catch (error) {
      toast.error("Erro ao remover");
      refreshCart();
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      if (cart) {
        setCart({
          ...cart,
          cartItems: cart.cartItems.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });
      }
      await CartService.updateItem(itemId, quantity);
      await refreshCart();
    } catch (error) {
      toast.error("Erro ao atualizar");
      refreshCart();
    }
  };

  const clearCart = async () => {
    try {
      setCart(null);
      await CartService.clearCart();
    } catch (error) {
      refreshCart();
    }
  }

  const itemCount = cart?.totalItems || 0;
  const cartTotal = cart?.total || "0.00";

  return (
    <CartContext.Provider
      value={{ cart, itemCount, cartTotal, isLoading, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
