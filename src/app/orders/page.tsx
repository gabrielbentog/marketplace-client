"use client";

import { useEffect } from "react";
import Link from "next/link";
import { OrderService } from "@/services/orders";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Package, Calendar, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/Skeleton";
import { useQuery } from "@tanstack/react-query";

export default function MyOrdersPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Proteção de rota (mantida para segurança)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
         router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // 2. QUERY: Busca automática
  const { data: orders = [], isLoading: isOrdersLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const response = await OrderService.getAll({ page: 1, per_page: 20 });
      return response.data || [];
    },
    enabled: isAuthenticated, // Só busca se logado
  });

  const statusVariant: Record<string, "default" | "success" | "warning" | "error"> = {
    pending: "warning",
    paid: "success",
    shipped: "default",
    completed: "success",
    cancelled: "error",
  };

  const orderStatusMap: Record<string, string> = {
    pending: "Pendente",
    paid: "Pago",
    shipped: "Enviado",
    completed: "Concluído",
    cancelled: "Cancelado",
  };

  // 3. Loading State com Skeleton
  if (authLoading || isOrdersLoading) {
    return (
      <div className="bg-gray-50 dark:bg-black min-h-screen py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                   <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                      </div>
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                   </div>
                   <Skeleton className="h-9 w-24 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Meus Pedidos</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nenhum pedido encontrado</h3>
            <p className="text-gray-500 mb-6">Você ainda não realizou nenhuma compra.</p>
            <Link href="/products">
              <Button>Começar a comprar</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Pedido #{order.id.slice(0, 8)}
                      </h3>
                      <Badge variant={statusVariant[order.status] || "default"}>
                        {orderStatusMap[order.status] || order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                      <span>•</span>
                      <span>Total: <span className="font-medium text-gray-900 dark:text-gray-200">{formatPrice(order.total)}</span></span>
                    </div>
                  </div>

                  <Link href={`/orders/${order.id}`}>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      Detalhes <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
