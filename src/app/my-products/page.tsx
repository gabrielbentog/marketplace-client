"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductService } from "@/services/products";
import { Product } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Edit, Trash2, Plus, PackageSearch, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/Skeleton";

export default function MyProductsPage() {
  // 1. Pegamos o isLoading do contexto e renomeamos para authLoading
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true); // Renomeei para evitar confusão
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // 2. Proteção de Rota Ajustada
  useEffect(() => {
    if (!authLoading && user && user.role !== "seller") {
      router.push("/"); // Proteção de Role continua no cliente por enquanto
    }
  }, [user, authLoading, router]);

  // Carregar Produtos
  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const response = await ProductService.getAll({
          page: 1,
          per_page: 50,
        });

        setProducts(response.data || []);
      } catch (error) {
        console.error("Erro ao carregar produtos", error);
        toast.error("Não foi possível carregar seus produtos.");
      } finally {
        setIsProductsLoading(false);
      }
    };

    // Só busca se a autenticação já terminou e o usuário for seller
    if (!authLoading && isAuthenticated && user?.role === "seller") {
      fetchMyProducts();
    }
  }, [isAuthenticated, user, authLoading]);

  // 3. Loading State Global (Auth ou Produtos)
  if (authLoading || (isAuthenticated && user?.role === "seller" && isProductsLoading)) {
    return (
      <div className="bg-gray-50 dark:bg-black min-h-screen py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
             <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
             </div>
             <Skeleton className="h-10 w-40" />
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex gap-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-4 w-1/4" />)}
            </div>
            <div className="divide-y divide-gray-200 dark:divide-zinc-800">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                   <Skeleton className="h-12 w-12 rounded" />
                   <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                   </div>
                   <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se passou do loading e não está autenticado (vai redirecionar via useEffect),
  // retornamos null para não piscar a tela vazia
  if (!isAuthenticated || user?.role !== "seller") return null;

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este anúncio?")) return;

    setIsDeleting(id);
    try {
      await ProductService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success("Anúncio excluído com sucesso.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir. Tente novamente.");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meus Anúncios</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Gerencie seu catálogo de produtos.
            </p>
          </div>
          <Link href="/products/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Novo Anúncio
            </Button>
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 shadow-sm border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
          {products.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 dark:bg-zinc-800">
                <PackageSearch className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nenhum produto cadastrado</h3>
              <p className="text-gray-500 mt-1 mb-6">Comece a vender adicionando seu primeiro produto.</p>
              <Link href="/products/new">
                <Button variant="outline">Criar Produto</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                <thead className="bg-gray-50 dark:bg-zinc-800/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Produto
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Preço
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Estoque
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
                  {products.map((product) => {
                    const image = getImageUrl(product.images?.[0]?.url);
                    return (
                      <tr key={product.id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative rounded overflow-hidden border border-gray-200 dark:border-zinc-700">
                              <img src={image} alt={product.name} className="h-full w-full object-cover object-center" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white max-w-[200px] truncate" title={product.name}>
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                ID: {product.id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white font-medium">
                            {formatPrice(product.price)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${product.stock > 0 ? "text-gray-900 dark:text-white" : "text-red-600 font-medium"}`}>
                            {product.stock} un.
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={product.status === 'active' ? 'success' : 'neutral'}>
                            {product.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/products/${product.id}/edit`}>
                              <Button variant="ghost" size="sm" title="Editar">
                                <Edit className="w-4 h-4 text-blue-600" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Excluir"
                              onClick={() => handleDelete(product.id)}
                              disabled={isDeleting === product.id}
                            >
                              {isDeleting === product.id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                              ) : (
                                <Trash2 className="w-4 h-4 text-red-600" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
