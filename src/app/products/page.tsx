import { ProductService } from "@/services/products";
import { CategoryService } from "@/services/categories"; // Importe
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters"; // Importe
import { Breadcrumbs } from "@/components/Breadcrumbs"; // Importe
import { Button } from "@/components/ui/Button";
import { PackageSearch, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Product, Category } from "@/types";

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  // Extração robusta dos novos parâmetros
  const page = Number(params.page) || 1;
  const search = typeof params.search === 'string' ? params.search : "";
  const categoryId = typeof params.category_id === 'string' ? params.category_id : undefined;
  const sort = typeof params.sort === 'string' ? params.sort : undefined;
  const inStock = params.in_stock === 'true';

  const perPage = 12;

  let products: Product[] = [];
  let categories: Category[] = [];
  let meta = null;

  try {
    // Busca paralela: Produtos (filtrados) + Lista de Categorias (para a sidebar)
    const [productsResponse, categoriesData] = await Promise.all([
      ProductService.getAll({
        page,
        per_page: perPage,
        search: search || undefined,
        category_id: categoryId,
        sort,       // Novo: Ordenação
        in_stock: inStock ? "true" : undefined // Novo: Filtro de estoque (ajuste se sua API esperar boolean ou string)
      }),
      CategoryService.getAll()
    ]);

    products = productsResponse.data || [];
    meta = productsResponse.meta;
    categories = categoriesData || [];

  } catch (error) {
    console.error("Erro ao carregar:", error);
  }

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <Breadcrumbs />

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

          {/* Sidebar de Filtros (Esquerda) - Desktop */}
          <aside className="w-full lg:w-64 shrink-0 lg:block">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-border p-6 shadow-sm">
                 <h2 className="font-bold text-lg mb-4 lg:hidden">Filtros</h2>
                 <ProductFilters categories={categories} />
              </div>
            </div>
          </aside>

          {/* Conteúdo Principal (Direita) */}
          <div className="flex-1">

            {/* Header da Lista */}
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground">
                {search ? `Resultados para "${search}"` : "Todos os Produtos"}
              </h1>
              <span className="text-sm text-muted-foreground">
                {meta?.total_count || 0} produtos encontrados
              </span>
            </div>

            {/* Grid */}
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {/* Ajustei para 3 colunas no desktop pq a sidebar ocupa espaço */}
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Paginação (Mantida igual, só ajustando o spread da query) */}
                {meta && (meta.total_pages > 1) && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <Link href={{ pathname: '/products', query: { ...params, page: page - 1 } }}>
                      <Button variant="outline" disabled={page <= 1}>
                        <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                      </Button>
                    </Link>

                    <span className="text-sm font-medium text-muted-foreground">
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
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-zinc-900 rounded-lg border border-border">
                <PackageSearch className="w-20 h-20 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-foreground">Nenhum produto encontrado</h3>
                <p className="text-muted-foreground mt-1">
                  Tente ajustar os filtros para encontrar o que procura.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
