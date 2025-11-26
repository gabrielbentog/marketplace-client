import api from '@/lib/api';
import { Product, PagedResponse } from '@/types';

export const ProductService = {
  getAll: async (params?: { page?: number; per_page?: number; search?: string; category_id?: string }) => {
    // Nota: Adapte o retorno conforme a estrutura real exata do seu backend (ex: se retorna { data: [...] } ou direto [...])
    const response = await api.get<PagedResponse<Product>>('/api/products', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Product>(`/api/products/${id}`);
    return response.data;
  },
};