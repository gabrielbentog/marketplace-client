import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductService } from "@/services/products";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductImageGallery } from "@/components/ProductImageGallery"; // <--- Importe aqui
import { Badge } from "@/components/ui/Badge";
import { ChevronLeft, Package, Store } from "lucide-react";
import { formatPrice } from "@/lib/utils";

// Tipagem correta para Next.js 15+
interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  // 1. Aguardamos os parâmetros da rota
  const { id } = await params;
  let product = null;

  try {
    // 2. Buscamos o produto no servidor (Server-Side Fetching)
    product = await ProductService.getById(id);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    notFound();
  }

  if (!product) return notFound();

  const formattedPrice = formatPrice(product.price);

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb / Voltar */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Voltar para produtos
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">

          {/* Coluna da Esquerda: Galeria Interativa */}
          <div className="mb-8 lg:mb-0">
            <ProductImageGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Coluna da Direita: Informações */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <div className="mb-4">
              {product.status === 'inactive' && (
                <Badge variant="neutral" className="mb-2">Indisponível</Badge>
              )}
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {product.name}
              </h1>
            </div>

            <div className="mt-3">
              <h2 className="sr-only">Informações do produto</h2>
              <p className="text-3xl tracking-tight text-gray-900 dark:text-white">
                {formattedPrice}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">Descrição</h3>
              <div className="mt-2 space-y-6 text-base text-gray-500 dark:text-gray-400">
                <p>{product.description}</p>
              </div>
            </div>

            {/* Informações Extras */}
            <div className="mt-8 border-t border-gray-200 dark:border-zinc-800 pt-8">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <Package className="w-4 h-4 mr-2" />
                <span>Estoque disponível: {product.stock} unidades</span>
              </div>

              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Store className="w-4 h-4 mr-2" />
                <span>Vendido por: {product.user?.name || product.seller_id || "Marketplace"}</span>
              </div>
            </div>

            {/* Área de Ação (Client Component) */}
            <div className="mt-10">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
