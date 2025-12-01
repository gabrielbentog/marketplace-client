"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AddressService } from "@/services/address";
import { toast } from "sonner";
import { Address } from "@/types";

const addressSchema = z.object({
  street: z.string().min(3, "Rua obrigatória"),
  city: z.string().min(2, "Cidade obrigatória"),
  state: z.string().min(2, "Estado obrigatório"),
  zipCode: z.string().min(8, "CEP inválido"),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  onSuccess: (newAddress: Address) => void;
  onCancel: () => void;
}

export function AddressForm({ onSuccess, onCancel }: AddressFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema)
  });

  const onSubmit = async (data: AddressFormValues) => {
    try {
      // Passamos addressType fixo como shipping
      const newAddress = await AddressService.create({ ...data, addressType: 'shipping' } as any);
      toast.success("Endereço salvo!");
      onSuccess(newAddress);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar endereço.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border p-4 rounded-md bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700">
      <h3 className="font-semibold text-gray-900 dark:text-white">Novo Endereço de Entrega</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input label="Rua / Número" {...register("street")} error={errors.street?.message} placeholder="Av. Paulista, 1000" />
        </div>
        <Input label="Cidade" {...register("city")} error={errors.city?.message} />
        <div className="grid grid-cols-2 gap-4">
            <Input label="Estado" {...register("state")} error={errors.state?.message} placeholder="SP" maxLength={2} />
            <Input label="CEP" {...register("zipCode")} error={errors.zipCode?.message} placeholder="00000-000" />
        </div>
      </div>

      <div className="flex gap-2 justify-end mt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Salvar Endereço
        </Button>
      </div>
    </form>
  );
}
