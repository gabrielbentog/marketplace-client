import { api } from "@/lib/api";
import { Address, DataWrapper } from "@/types";

export const AddressService = {
getAll: async (): Promise<Address[]> => {
    const response = await api.get<DataWrapper<Address[]>>("/api/addresses");
    // Garante que retorna array mesmo se vier null
    return response.data.data || [];
  },

  create: async (data: any): Promise<Address> => {
    const payload = {
      street: data.street,
      city: data.city,
      state: data.state,
      zip_code: data.zipCode,
      address_type: data.addressType
    };

    // Tipamos o retorno para saber que vem dentro de um wrapper
    const response = await api.post<DataWrapper<Address>>("/api/addresses", {
      address: payload
    });

    // CORREÇÃO: Acessa .data.data (onde o objeto real mora)
    const responseData = response.data;
    return responseData.data || (responseData as any);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/addresses/${id}`);
  }
};
