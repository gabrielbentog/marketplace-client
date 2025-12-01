"use client";

import { useState } from "react";
import { ProductImage } from "@/types";
import { getImageUrl, cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Importe os ícones

interface ProductImageGalleryProps {
  images: ProductImage[] | undefined;
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 border border-gray-200 dark:border-zinc-800">
        <img
          src="https://placehold.co/600x600?text=Sem+Imagem"
          alt={productName}
          className="h-full w-full object-cover object-center"
        />
      </div>
    );
  }

  const activeImage = images[selectedIndex];

  // Funções de Navegação
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Imagem Principal (Com Setas) */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 border border-gray-200 dark:border-zinc-800 shadow-sm group">
        <img
          src={getImageUrl(activeImage.url)}
          alt={activeImage.filename || productName}
          className="h-full w-full object-cover object-center absolute inset-0 transition-opacity duration-300"
        />

        {/* Setas e Indicadores (Só se houver mais de 1 imagem) */}
        {images.length > 1 && (
          <>
            {/* Botão Anterior */}
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white dark:bg-black/50 dark:text-white dark:hover:bg-black/80 focus:opacity-100"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Botão Próximo */}
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white dark:bg-black/50 dark:text-white dark:hover:bg-black/80 focus:opacity-100"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Indicadores (Bolinhas) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-2 h-2 rounded-full shadow-sm transition-all",
                    idx === selectedIndex
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/80"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Miniaturas (Grid) */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4 sm:gap-6">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md bg-gray-100 border-2 cursor-pointer transition-all",
                selectedIndex === index
                  ? "border-blue-600 ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-black"
                  : "border-transparent hover:border-gray-300 dark:hover:border-zinc-700"
              )}
            >
              <img
                src={getImageUrl(image.url)}
                alt={`Miniatura ${index + 1}`}
                className="h-full w-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
