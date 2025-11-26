import { api } from "@/lib/api";
import { Product, DataWrapper } from "@/types";

// Tipagem dos filtros disponíveis na API
interface ProductFilters {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: string;
  sort?: string; // ex: 'price_asc', 'created_desc'
}

export const ProductService = {
  getAll: async (params?: ProductFilters): Promise<DataWrapper<Product[]>> => {
      // Se a lista também vier dentro de 'data', o axios.get retorna { data: { data: [...] } }
      // Então response.data já é o objeto DataWrapper
      const response = await api.get<DataWrapper<Product[]>>("/api/products", {
        params,
      });
      return response.data;
    },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get<DataWrapper<Product>>(`/api/products/${id}`);
    
    return response.data.data;
  },
};