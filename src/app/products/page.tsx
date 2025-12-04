import { ProductService } from "@/services/products";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/Button";
import { PackageSearch, ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { Product } from "@/types";
import { CategoryService } from "@/services/categories";
import { Breadcrumbs } from "@/components/Breadcrumbs";

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const search = typeof params.search === 'string' ? params.search : "";
  const categoryId = typeof params.category_id === 'string' ? params.category_id : undefined;
  const perPage = 12;

  let products: Product[] = [];
  let meta = null;
  let categoryName = null;

  try {
    // Busca produtos
    const response = await ProductService.getAll({
      page,
      per_page: perPage,
      search: search || undefined,
      category_id: categoryId
    });

    products = response.data || [];
    meta = response.meta;

    // Pequena melhoria: Buscar nome da categoria se tiver ID filtrado
    // (Para mostrar "Categoria: Eletrônicos" em vez de "Categoria: ID-123")
    if (categoryId) {
        const categories = await CategoryService.getAll();
        const category = categories.find(c => c.id === categoryId);
        categoryName = category?.name;
    }

  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
  }

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs />
        {/* Cabeçalho Limpo */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Explorar Produtos
            </h1>

            {/* Botão Limpar Filtros (Só aparece se tiver filtros) */}
            {(search || categoryId) && (
               <Link href="/products">
                 <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:bg-red-900/20">
                   Limpar Filtros
                   <X className="ml-2 h-4 w-4" />
                 </Button>
               </Link>
            )}
          </div>

          {/* Feedback dos Filtros Ativos (Badges de informação) */}
          {(search || categoryName) && (
            <div className="flex flex-wrap gap-2">
              {search && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 bg-blue-900/30 text-blue-300">
                  Busca: <span className="font-semibold ml-1">&quot;{search}&quot;</span>
                </div>
              )}
              {categoryName && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 bg-purple-900/30 text-purple-300">
                  Categoria: <span className="font-semibold ml-1">{categoryName}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Paginação */}
            {meta && (meta.total_pages > 1) && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <Link href={{ pathname: '/products', query: { ...params, page: page - 1 } }}>
                  <Button variant="outline" disabled={page <= 1}>
                    <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                  </Button>
                </Link>

                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Página {meta.current_page} de {meta.total_pages}
                </span>

                <Link href={{ pathname: '/products', query: { ...params, page: page + 1 } }}>
                  <Button variant="outline" disabled={page >= meta.total_pages}>
                    Próxima <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white bg-zinc-900 rounded-lg border border-gray-200 border-zinc-800">
            <PackageSearch className="w-20 h-20 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 text-white">Nenhum produto encontrado</h3>
            <p className="text-gray-500 mt-1">
              Não encontramos resultados para sua busca.
            </p>
            {(search || categoryId) && (
              <Link href="/products" className="mt-4">
                <Button variant="outline">Limpar filtros e ver tudo</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
