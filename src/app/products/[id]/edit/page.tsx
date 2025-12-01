"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { CategoryService } from "@/services/categories";
import { ProductService } from "@/services/products";
import { Category, Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUpload } from "@/components/ImageUpload";
import { toast } from "sonner";
import { ArrowLeft, Loader2, X } from "lucide-react";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";

// Schema (mesmo da criação)
const productSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  description: z.string().min(10, "Descrição deve ser mais detalhada"),
  price: z.string().min(1, "Preço obrigatório"),
  stock: z.coerce.number().min(0, "Estoque obrigatório"), // coerce converte string pra number
  category_id: z.string().min(1, "Selecione uma categoria"),
  status: z.enum(["active", "inactive"]),
});

type ProductFormValues = z.infer<typeof productSchema>;

// Props para receber o ID (Next.js 15: params é Promise)
interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  // Desembrulha params com hook use() (React 19/Next 15)
  const { id } = use(params);

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema)
    });

  // 1. Proteção de Rota
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) router.push("/login");
    else if (user?.role !== "seller") router.push("/");
  }, [isAuthenticated, user, router, authLoading]);

  // 2. Carregar Dados Iniciais (Categorias + Produto)
  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, prodData] = await Promise.all([
          CategoryService.getAll(),
          ProductService.getById(id)
        ]);

        setCategories(cats);
        setProduct(prodData);

        // Verifica se o usuário é o dono do produto
        if (prodData.user?.id !== user?.id && user?.role !== 'admin') {
          toast.error("Você não tem permissão para editar este produto.");
          router.push("/my-products");
          return;
        }

        // Popula o formulário
        reset({
          name: prodData.name,
          description: prodData.description || "",
          price: prodData.price, // String
          stock: prodData.stock,
          category_id: prodData.categories?.[0]?.id || "", // Pega a primeira categoria se houver
          status: prodData.status,
        });

      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar dados do produto.");
        router.push("/my-products");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (isAuthenticated && user?.role === "seller") {
      loadData();
    }
  }, [id, isAuthenticated, user, reset, router]);

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      formData.append("product[name]", data.name);
      formData.append("product[description]", data.description);
      formData.append("product[price]", data.price.replace(',', '.'));
      formData.append("product[stock]", String(data.stock));
      formData.append("product[status]", data.status);
      formData.append("category_ids[]", data.category_id);

      // Adiciona apenas NOVAS imagens
      selectedImages.forEach((file) => {
        formData.append("images[]", file);
      });

      await ProductService.update(id, formData);

      toast.success("Produto atualizado com sucesso!");
      router.push("/my-products");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar produto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoadingData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        <Link href="/my-products" className="flex items-center text-sm text-gray-500 mb-6 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para Meus Anúncios
        </Link>

        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editar Anúncio</h1>
            <span className="text-sm text-gray-500 font-mono">ID: {product.id.slice(0, 8)}</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* Seção de Imagens Existentes + Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Fotos</label>

              {/* Fotos Atuais (Visualização Apenas) */}
              {product.images && product.images.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Imagens Atuais</span>
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.map((img) => (
                    <div key={img.id} className="relative aspect-square rounded-md overflow-hidden border border-gray-200 dark:border-zinc-700">
                        <img src={getImageUrl(img.url)} alt={product.name} className="h-full w-full object-cover object-center" />
                    </div>
                    ))}
                  </div>
                </div>
              )}

              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Adicionar Novas</span>
              <ImageUpload onImagesSelected={(files) => setSelectedImages(prev => [...prev, ...files])} />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Input
                label="Título"
                {...register("name")}
                error={errors.name?.message}
              />

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Descrição</label>
                <textarea
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                  {...register("description")}
                />
                {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Input
                  label="Preço (R$)"
                  type="number"
                  step="0.01"
                  {...register("price")}
                  error={errors.price?.message}
                />

                <Input
                  label="Estoque"
                  type="number"
                  {...register("stock")}
                  error={errors.stock?.message}
                />

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Status</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                    {...register("status")}
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo (Pausado)</option>
                  </select>
                </div>
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

            <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-3">
              <Link href="/my-products">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
              <Button type="submit" size="lg" isLoading={isSubmitting}>
                Salvar Alterações
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
