import { ProductService } from "@/services/products";
import { CategoryService } from "@/services/categories"; // <--- Importe o serviço
import { ProductCard } from "@/components/ProductCard";
import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/Button"; // <--- Importe Button
import Link from "next/link"; // <--- Importe Link
import { Product, Category } from "@/types"; // <--- Importe Category

export default async function HomePage() {
  let products: Product[] = [];
  let categories: Category[] = []; // <--- Estado das categorias
  let error: string | null = null;

  try {
    // Busca paralela para ser mais rápido
    const [productsData, categoriesData] = await Promise.all([
      ProductService.getAll({ page: 1, per_page: 8 }), // Pegamos apenas 8 destaques
      CategoryService.getAll()
    ]);

    products = productsData.data || [];
    categories = categoriesData || []; // Ajuste conforme o retorno do seu serviço
  } catch (e) {
    console.error("Erro ao carregar dados:", e);
    error = "Não foi possível carregar o conteúdo.";
  }

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen">
      {/* Hero Section */}
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            MarketPlace
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Encontre produtos incríveis com os melhores preços.
          </p>

          {/* Lista de Categorias (Pílulas) */}
          {categories.length > 0 && (
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/products?category_id=${cat.id}`}>
                  <Button variant="secondary" size="sm" className="rounded-full">
                    {cat.name}
                  </Button>
                </Link>
              ))}
              <Link href="/products">
                <Button variant="outline" size="sm" className="rounded-full">
                  Ver Todos
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Grid de Produtos */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Destaques
          </h2>
          <Link href="/products" className="text-blue-600 hover:underline text-sm font-medium">
            Ver tudo &rarr;
          </Link>
        </div>

        {error ? (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <PackageSearch className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg">Nenhum produto em destaque.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
