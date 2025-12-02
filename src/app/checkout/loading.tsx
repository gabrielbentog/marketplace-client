import { Skeleton } from "@/components/ui/Skeleton";

export default function CheckoutLoading() {
  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-64 mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Esquerda */}
          <div className="md:col-span-2 space-y-8">
            {/* Endereço */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800">
              <div className="flex justify-between mb-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-8 w-20" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-20 w-full rounded-md" />
                <Skeleton className="h-20 w-full rounded-md" />
              </div>
            </div>

            {/* Pagamento */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="grid grid-cols-3 gap-3">
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
              </div>
            </div>
          </div>

          {/* Direita */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3 mb-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="border-t pt-4 mb-6 border-gray-100 dark:border-zinc-700">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
