import { api } from "@/lib/api";
import { Cart, DataWrapper } from "@/types";

export const CartService = {
  getCart: async (): Promise<Cart | null> => {
    try {
      const response = await api.get<DataWrapper<Cart>>("/api/cart");
      return response.data.data;
    } catch (error) {
      console.error("Erro no getCart:", error);
      return null;
    }
  },

  addItem: async (productId: string, quantity = 1) => {
    await api.post("/api/cart/items", {
      product_id: productId,
      quantity,
    });
  },

  removeItem: async (itemId: string) => {
    await api.delete(`/api/cart/items/${itemId}`);
  },

  updateItem: async (itemId: string, quantity: number) => {
    await api.patch(`/api/cart/items/${itemId}`, {
      quantity
    });
  },

  clearCart: async (): Promise<void> => {
    await api.delete("/api/cart");
  }
};
