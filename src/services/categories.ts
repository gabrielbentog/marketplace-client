import { api } from "@/lib/api";
import { Category, DataWrapper } from "@/types";

export const CategoryService = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await api.get<DataWrapper<Category[]>>("/api/categories");
      return response.data.data || (response.data as any) || [];
    } catch (error) {
      console.error("Erro ao buscar categorias", error);
      return [];
    }
  }
};
