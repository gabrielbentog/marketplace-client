import { api } from "@/lib/api";
import { Product, DataWrapper } from "@/types";

interface ProductFilters {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: string;
  sort?: string;
  seller_id?: string;
}

export const ProductService = {
  getAll: async (params?: ProductFilters): Promise<DataWrapper<Product[]>> => {
    const response = await api.get<DataWrapper<Product[]>>("/api/products", {
      params,
    });
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get<DataWrapper<Product>>(`/api/products/${id}`);
    return response.data.data;
  },

  create: async (formData: FormData): Promise<Product> => {
    const response = await api.post("/api/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const data = response.data as any;
    return data.data || data;
  },

  update: async (id: string, formData: FormData): Promise<Product> => {
    const response = await api.patch(`/api/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const data = response.data as any;
    return data.data || data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/products/${id}`);
  }
};
