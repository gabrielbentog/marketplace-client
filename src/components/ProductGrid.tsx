"use client";

import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { motion } from "framer-motion";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  // Configuração da animação
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 // Intervalo de 0.1s entre cada card
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 }, // Começa invisível e um pouco para baixo
    show: { opacity: 1, y: 0 }     // Termina visível na posição original
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={item}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
