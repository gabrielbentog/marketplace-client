import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Fallback seguro se não houver imagem
  const mainImage = product.images?.[0]?.url || "https://placehold.co/600x400?text=Sem+Imagem";
  
  // Formatação de preço (BRL)
  const formattedPrice = formatPrice(product.price);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      
      {/* Imagem com Link */}
      <Link href={`/products/${product.id}`} className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Badges de Status */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {isOutOfStock ? (
            <Badge variant="error">Esgotado</Badge>
          ) : product.status === 'inactive' ? (
            <Badge variant="neutral">Indisponível</Badge>
          ) : null}
        </div>
      </Link>

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 dark:text-gray-100 line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400">Preço</span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {formattedPrice}
            </span>
          </div>

          {/* Botão de Adicionar (Visual por enquanto) */}
          <Button 
            size="sm" 
            variant="secondary" 
            disabled={isOutOfStock}
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
            title="Adicionar ao carrinho"
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}