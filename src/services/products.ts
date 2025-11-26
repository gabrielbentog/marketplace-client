import { api } from "@/lib/api";
import { Product, ApiListResponse } from "@/types";

// Tipagem dos filtros disponíveis na API
interface ProductFilters {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: string;
  sort?: string; // ex: 'price_asc', 'created_desc'
}

export const ProductService = {
  getAll: async (params?: ProductFilters): Promise<ApiListResponse<Product>> => {
    // O axios serializa automaticamente o objeto params para query string
    // ex: /api/products?page=1&per_page=12
    const response = await api.get<ApiListResponse<Product>>("/api/products", {
      params,
    });
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/api/products/${id}`);
    return response.data;
  },
};