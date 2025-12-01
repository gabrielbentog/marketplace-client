import { api } from "@/lib/api";
import { Order } from "@/types";

export const CheckoutService = {
  processCheckout: async (addressId: string, paymentMethod: string): Promise<Order> => {
    const response = await api.post("/api/checkout", {
      address_id: addressId,
      payment_method: paymentMethod
    });

    const data = response.data as any;
    return data.order || data.data?.order;
  }
};
