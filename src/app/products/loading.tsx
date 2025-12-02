import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductsLoading() {
  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Cabeçalho e Busca Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <Skeleton className="h-10 w-48" /> {/* Título */}
          <div className="flex gap-2 w-full md:w-auto">
            <Skeleton className="h-10 w-full md:w-80" /> {/* Input */}
            <Skeleton className="h-10 w-20" /> {/* Botão */}
          </div>
        </div>

        {/* Grid de Produtos Skeleton */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex justify-between items-center mt-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
