import { ProductService } from "@/services/products";
import { ProductCard } from "@/components/ProductCard";
import { PackageSearch } from "lucide-react";
import { Product } from "@/types";
// Server Component (padrão no Next.js 13+)
export default async function HomePage() {
  let products: Product[] = [];
  let error: string | null = null;

  try {
    // Busca a primeira página de produtos
    const response = await ProductService.getAll({ page: 1, per_page: 12 });
    // Verifica se a resposta veio no formato esperado (com data array ou meta)
    // Adapte conforme a resposta real da sua API se necessário
    products = response.data || [];
  } catch (e) {
    console.error("Erro ao carregar produtos:", e);
    error = "Não foi possível carregar os produtos no momento.";
  }

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen">
      {/* Hero Section Simples */}
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            As melhores ofertas do mercado
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore nossa seleção exclusiva de produtos com os melhores preços e entrega garantida.
          </p>
        </div>
      </div>

      {/* Grid de Produtos */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Destaques
          </h2>
          {/* Aqui entraremos com filtros no futuro */}
        </div>

        {error ? (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <PackageSearch className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg">Nenhum produto encontrado.</p>
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