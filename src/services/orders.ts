import { api } from "@/lib/api";
import { Order, DataWrapper } from "@/types";

interface OrderFilters {
  page?: number;
  per_page?: number;
  status?: string;
}

export const OrderService = {
  // GET /api/orders (Meus Pedidos)
  getAll: async (params?: OrderFilters): Promise<DataWrapper<Order[]>> => {
    // A API retorna { data: [...], meta: ... }
    const response = await api.get<DataWrapper<Order[]>>("/api/orders", { params });
    return response.data;
  },

  // GET /api/orders/:id (Detalhes)
  getById: async (id: string): Promise<Order> => {
    const response = await api.get<DataWrapper<Order>>(`/api/orders/${id}`);
    // Retorna o objeto order que está dentro de data
    return response.data.data;
  }
};
