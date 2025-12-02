import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductLoading() {
  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <Skeleton className="h-4 w-32 mb-6" />

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Coluna Esquerda: Imagem */}
          <Skeleton className="aspect-square w-full rounded-lg" />

          {/* Coluna Direita: Infos */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-10 w-32 mb-6" />

            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-zinc-800">
              <Skeleton className="h-4 w-48 mb-4" />
              <Skeleton className="h-4 w-40" />
            </div>

            <div className="mt-10">
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
