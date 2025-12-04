import Link from "next/link";
import { ProductService } from "@/services/products";
import { CategoryService } from "@/services/categories";
import { ProductGrid } from "@/components/ProductGrid";
import { HeroCarousel } from "@/components/HeroCarousel"; // <--- Importe aqui
import { PackageSearch, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Product, Category } from "@/types";

export default async function HomePage() {
  let products: Product[] = [];
  let categories: Category[] = [];
  let error: string | null = null;

  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      ProductService.getAll({ page: 1, per_page: 8 }),
      CategoryService.getAll()
    ]);

    products = productsResponse.data || [];
    categories = categoriesResponse || [];
  } catch (e) {
    console.error("Erro ao carregar dados:", e);
    error = "Não foi possível carregar o conteúdo no momento.";
  }

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen">

      {/* 1. HERO CAROUSEL */}
      <HeroCarousel />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* 2. SEÇÃO DE CATEGORIAS (Cards Modernos) */}
        {categories.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Navegue por Categorias
              </h2>
              <Link href="/products" className="text-primary font-medium hover:underline flex items-center text-sm">
                Ver todas <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.slice(0, 6).map((cat) => (
                <Link key={cat.id} href={`/products?category_id=${cat.id}`} className="group">
                  <div className="h-32 rounded-xl bg-white dark:bg-zinc-900 border border-border p-4 flex flex-col items-center justify-center gap-3 hover:border-primary hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                    {/* Como não temos ícone na API, usamos um genérico com cor de fundo */}
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <Tag className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary text-center line-clamp-2">
                      {cat.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 3. SEÇÃO DE DESTAQUES (Produtos) */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Produtos em Destaque
            </h2>
            <Link href="/products" className="hidden sm:flex">
               <Button variant="outline">Ver catálogo completo</Button>
            </Link>
          </div>

          {error ? (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-lg border border-border">
              <p className="text-red-500">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white dark:bg-zinc-900 rounded-lg border border-border">
              <PackageSearch className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">Nenhum destaque no momento.</p>
            </div>
          ) : (
            // Nosso Grid Animado
            <ProductGrid products={products} />
          )}

          <div className="mt-8 text-center sm:hidden">
             <Link href="/products">
                <Button className="w-full">Ver catálogo completo</Button>
             </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
