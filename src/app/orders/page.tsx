"use client"; // <--- MUDANÇA CRUCIAL

import { useEffect, useState } from "react";
import Link from "next/link";
import { OrderService } from "@/services/orders";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Package, Calendar, ChevronRight, Loader2 } from "lucide-react";
import { Order } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Proteção de rota
  useEffect(() => {
    if (!isAuthenticated) {
      // Pequeno delay para garantir que o auth carregou
      const timeout = setTimeout(() => {
         if (!isAuthenticated) router.push("/login");
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await OrderService.getAll({ page: 1, per_page: 20 });
        setOrders(response.data || []);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const statusVariant: Record<string, "default" | "success" | "warning" | "error"> = {
    pending: "warning",
    paid: "success",
    shipped: "default",
    completed: "success",
    cancelled: "error",
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
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
                        {order.status}
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
