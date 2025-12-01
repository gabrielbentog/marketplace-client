import { ProductService } from "@/services/products";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PackageSearch, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Product } from "@/types";

// Tipagem para receber query params (Next.js 15+)
interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  // Extrai filtros da URL
  const page = Number(params.page) || 1;
  const search = typeof params.search === 'string' ? params.search : "";
  const perPage = 12;

  let products: Product[] = [];
  let meta = null;

  try {
    const response = await ProductService.getAll({
      page,
      per_page: perPage,
      search: search || undefined
    });

    products = response.data || [];
    meta = response.meta;
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
  }

  // Ação de servidor para busca (Formulário simples)
  async function searchProducts(formData: FormData) {
    "use server";
    const query = formData.get("search")?.toString();
    redirect(`/products?search=${query || ""}`);
  }

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Cabeçalho e Busca */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Explorar Produtos
          </h1>

          <form action={searchProducts} className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Input
                name="search"
                placeholder="Buscar produtos..."
                defaultValue={search}
                className="pr-10"
              />
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            <Button type="submit">Buscar</Button>
          </form>
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Paginação Simples */}
            {meta && (meta.total_pages > 1) && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <Link href={`/products?page=${page - 1}&search=${search}`}>
                  <Button variant="outline" disabled={page <= 1}>
                    <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                  </Button>
                </Link>

                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Página {meta.current_page} de {meta.total_pages}
                </span>

                <Link href={`/products?page=${page + 1}&search=${search}`}>
                  <Button variant="outline" disabled={page >= meta.total_pages}>
                    Próxima <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <PackageSearch className="w-20 h-20 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nenhum produto encontrado</h3>
            <p className="text-gray-500 mt-1">Tente buscar por outro termo ou limpe os filtros.</p>
            {search && (
              <Link href="/products" className="mt-4">
                <Button variant="outline">Limpar busca</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
