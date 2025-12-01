"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { CategoryService } from "@/services/categories";
import { ProductService } from "@/services/products";
import { Category } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUpload } from "@/components/ImageUpload";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

// Validação
const productSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ser mais detalhada"),
  price: z.string().min(1, "Preço é obrigatório"),
  stock: z.string().min(1, "Estoque é obrigatório"),
  category_id: z.string().min(1, "Selecione uma categoria"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema)
  });

  // Proteção de Rota
  useEffect(() => {
    // Pequeno delay para garantir que o AuthContext carregou
    if (!isAuthenticated) {
        const timeout = setTimeout(() => {
             if (!isAuthenticated) router.push("/login");
             else setIsLoadingAuth(false);
        }, 500);
        return () => clearTimeout(timeout);
    } else if (user?.role !== "seller") {
      toast.error("Apenas vendedores podem criar produtos.");
      router.push("/");
    } else {
        setIsLoadingAuth(false);
    }
  }, [isAuthenticated, user, router]);

  // Carregar Categorias
  useEffect(() => {
    const loadCategories = async () => {
      const data = await CategoryService.getAll();
      setCategories(data);
    };
    if (isAuthenticated) loadCategories();
  }, [isAuthenticated]);

    const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      // 1. Instancia o FormData (NÃO crie um objeto JSON)
      const formData = new FormData();

      // 2. Anexa campos de texto (note o formato "product[campo]")
      formData.append("product[name]", data.name);
      formData.append("product[description]", data.description);
      formData.append("product[price]", data.price.replace(',', '.'));
      formData.append("product[stock]", data.stock);
      formData.append("product[status]", "active");

      // 3. Categorias (se for array, pode precisar de loop ou envio simples)
      formData.append("category_ids[]", data.category_id);

      // 4. Imagens (O segredo está aqui)
      if (selectedImages.length > 0) {
        selectedImages.forEach((file) => {
          // O backend espera um array de arquivos na chave "images[]"
          formData.append("images[]", file);
        });
      }

      // 5. Envia o FormData, NÃO o objeto 'data'
      await ProductService.create(formData);

      toast.success("Anúncio criado com sucesso!");
      router.push("/my-products");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar o produto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Evita flash de conteúdo
  if (!user || user.role !== "seller") return null;

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        <Link href="/my-products" className="flex items-center text-sm text-gray-500 mb-6 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para Meus Anúncios
        </Link>

        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Criar Novo Anúncio</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
            Preencha os dados abaixo para publicar seu produto no marketplace.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* Seção de Imagens */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Fotos do Produto</label>
                <span className="text-xs text-gray-500 dark:text-gray-400">Adicione até 5 fotos. A primeira será a capa.</span>
              </div>
              <ImageUpload onImagesSelected={(files) => setSelectedImages(prev => [...prev, ...files])} />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Input
                label="Título do Anúncio"
                placeholder="Ex: Smartphone Samsung Galaxy S23"
                {...register("name")}
                error={errors.name?.message}
              />

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Descrição Detalhada</label>
                <textarea
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] dark:bg-zinc-800 dark:border-zinc-700 dark:text-white placeholder:text-gray-400"
                  placeholder="Descreva as características, estado de conservação e diferenciais do produto..."
                  {...register("description")}
                />
                {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Preço (R$)"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("price")}
                  error={errors.price?.message}
                />

                <Input
                  label="Estoque Disponível"
                  type="number"
                  placeholder="1"
                  {...register("stock")}
                  error={errors.stock?.message}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Categoria</label>
                <select
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                  {...register("category_id")}
                >
                  <option value="">Selecione uma categoria...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.category_id && <p className="text-xs text-red-500">{errors.category_id.message}</p>}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
              <Button type="submit" className="w-full sm:w-auto sm:float-right" size="lg" isLoading={isSubmitting}>
                Publicar Anúncio
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
