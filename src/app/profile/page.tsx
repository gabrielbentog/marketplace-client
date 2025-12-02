"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthService } from "@/services/auth";
import { AddressService } from "@/services/address";
import { Address } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { User, MapPin, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/Skeleton";

// Schema para validação
const profileSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().optional().or(z.literal('')), // Senha opcional
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"info" | "addresses">("info");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema)
  });

  // 1. Proteção e Carga Inicial
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
        router.push("/login");
        return;
    }

    if (user) {
      setValue("name", user.name || "");
      setValue("email", user.email || "");
    }
  }, [authLoading, isAuthenticated, user, router, setValue]);

  // Carrega endereços quando a aba muda
  useEffect(() => {
    if (activeTab === "addresses" && isAuthenticated) {
      setIsLoadingAddresses(true);
      AddressService.getAll()
        .then(setAddresses)
        .finally(() => setIsLoadingAddresses(false));
    }
  }, [activeTab, isAuthenticated]);

  // 2. Atualizar Perfil
  const onUpdateProfile = async (data: ProfileForm) => {
    if (!user) return;
    setIsSaving(true);
    try {
      const payload: any = { name: data.name, email: data.email };
      if (data.password) payload.password = data.password;

      await AuthService.updateProfile(user.id, payload);
      toast.success("Perfil atualizado com sucesso!");

      // Recarrega a página para atualizar o contexto global se necessário
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Excluir Endereço
  const onDeleteAddress = async (id: string) => {
    if (!confirm("Deseja excluir este endereço?")) return;
    try {
      await AddressService.delete(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
      toast.success("Endereço removido.");
    } catch {
      toast.error("Erro ao remover endereço.");
    }
  };

  // Loading State (Evita piscada)
  if (authLoading) {
     return (
       <div className="bg-gray-50 dark:bg-black min-h-screen py-10">
         <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
           <Skeleton className="h-10 w-48 mb-8" />
           <div className="flex flex-col md:flex-row gap-8">
             <div className="w-full md:w-64 space-y-2">
               <Skeleton className="h-10 w-full" />
               <Skeleton className="h-10 w-full" />
             </div>
             <div className="flex-1 bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800">
               <Skeleton className="h-6 w-32 mb-6" />
               <div className="space-y-6">
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
               </div>
             </div>
           </div>
         </div>
       </div>
     );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Minha Conta</h1>

        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar de Navegação */}
          <aside className="w-full md:w-64 shrink-0">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("info")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "info"
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-zinc-800"
                }`}
              >
                <User className="mr-3 h-5 w-5" /> Meus Dados
              </button>
              <button
                onClick={() => setActiveTab("addresses")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "addresses"
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-zinc-800"
                }`}
              >
                <MapPin className="mr-3 h-5 w-5" /> Endereços
              </button>
            </nav>
          </aside>

          {/* Área de Conteúdo */}
          <div className="flex-1 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6">

            {activeTab === "info" && (
              <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-6 max-w-lg">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Informações Pessoais</h2>
                  <div className="space-y-4">
                    <Input label="Nome Completo" {...register("name")} error={errors.name?.message} />
                    <Input label="E-mail" {...register("email")} error={errors.email?.message} />
                    <div className="pt-2">
                        <Input label="Nova Senha (opcional)" type="password" placeholder="Deixe em branco para manter" {...register("password")} error={errors.password?.message} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" isLoading={isSaving}>Salvar Alterações</Button>
                </div>
              </form>
            )}

            {activeTab === "addresses" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Meus Endereços</h2>
                  {/* Futuramente pode adicionar botão de "Novo Endereço" aqui que abre o AddressForm num modal */}
                </div>

                {isLoadingAddresses ? (
                   <div className="space-y-4">
                      {[1,2].map(i => <Skeleton key={i} className="h-20 w-full" />)}
                   </div>
                ) : addresses.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhum endereço salvo. Adicione um durante o checkout.</p>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="flex items-start justify-between p-4 border rounded-md dark:border-zinc-700">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{addr.street}</p>
                          <p className="text-sm text-gray-500">{addr.city} - {addr.state}</p>
                          <p className="text-sm text-gray-500">{addr.zipCode}</p>
                        </div>
                        <button
                          onClick={() => onDeleteAddress(addr.id)}
                          className="text-gray-400 hover:text-red-600 p-2 transition-colors"
                          title="Excluir endereço"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
