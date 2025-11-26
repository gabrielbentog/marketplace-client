import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Fallback para imagem
  const imageUrl = product.image_urls?.[0] || 'https://placehold.co/600x400?text=No+Image';

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        {/* Badge de Status */}
        {product.stock <= 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Esgotado
          </span>
        )}
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
        </div>
        <p className="text-sm font-bold text-gray-900">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(product.price))}
        </p>
      </div>
    </Link>
  );
}