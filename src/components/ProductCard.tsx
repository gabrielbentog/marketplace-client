import Link from "next/link";
import { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import { ProductCardAction } from "./ProductCardAction";
import { getImageUrl } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Fallback seguro se não houver imagem
  const mainImage = getImageUrl(product.images?.[0]?.url);

  // Formatação de preço (BRL)
  const formattedPrice = formatPrice(product.price);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      {/* Imagem com Link */}
      <Link href={`/products/${product.id}`} className="relative aspect-square w-full overflow-hidden bg-secondary">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover object-center absolute inset-0"
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
            <h3 className="text-lg font-semibold text-foreground hover:text-primary line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {product.description}
            {product.description}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Preço</span>
            <span className="text-xl font-bold text-primary">
              {formattedPrice}
            </span>
          </div>

          <ProductCardAction product={product} />
        </div>
      </div>
    </div>
  );
}
