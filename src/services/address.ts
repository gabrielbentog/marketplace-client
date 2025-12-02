import { api } from "@/lib/api";
import { Address, DataWrapper } from "@/types";

export const AddressService = {
  getAll: async (): Promise<Address[]> => {
    // GET /api/addresses
    const response = await api.get<DataWrapper<Address[]>>("/api/addresses");
    // O backend retorna { data: [...] }
    return response.data.data || [];
  },

  create: async (data: any): Promise<Address> => {
    // Conversão para snake_case para enviar ao backend
    const payload = {
      street: data.street,
      city: data.city,
      state: data.state,
      zip_code: data.zipCode, // Enviando como zip_code
      address_type: data.addressType // Enviando como address_type
    };

    const response = await api.post("/api/addresses", {
      address: payload
    });

    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/addresses/${id}`);
  }
};
