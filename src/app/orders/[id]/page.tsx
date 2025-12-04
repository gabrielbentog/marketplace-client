"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { OrderService } from "@/services/orders";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, MapPin, CreditCard } from "lucide-react";
import { OrderItem } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/Skeleton";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
        router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const { data: order, isLoading: isOrderLoading, isError } = useQuery({
    queryKey: ['order-details', id],
    queryFn: () => OrderService.getById(id),
    enabled: isAuthenticated && !!id,
  });

  if (authLoading || isOrderLoading) {
    return (
      <div className="bg-gray-50 dark:bg-black min-h-screen py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-5 w-32 mb-6" />

          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
               <Skeleton className="h-8 w-64 mb-2" />
               <Skeleton className="h-4 w-48" />
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="md:col-span-2 space-y-4">
                  <Skeleton className="h-5 w-32" />
                  {[1, 2].map(i => <Skeleton key={i} className="h-16 w-full rounded" />)}
               </div>
               <div>
                  <Skeleton className="h-5 w-32 mb-3" />
                  <Skeleton className="h-24 w-full rounded-md" />
               </div>
               <div>
                  <Skeleton className="h-5 w-32 mb-3" />
                  <Skeleton className="h-24 w-full rounded-md" />
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-black">
        <p className="text-lg text-gray-500 mb-2">Pedido não encontrado.</p>
        <Link href="/orders" className="text-blue-600 hover:underline">Voltar</Link>
      </div>
    );
  }

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

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        <Breadcrumbs lastItemLabel={`Pedido #${order.id.slice(0, 8)}`} />

        <Link href="/orders" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 dark:text-gray-400 dark:hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para meus pedidos
        </Link>

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm">

          <div className="bg-gray-50 dark:bg-zinc-800/50 px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                Pedido #{order.id.slice(0, 8)}
                <Badge variant={statusVariant[order.status] || "default"}>
                  {orderStatusMap[order.status] || order.status}
                </Badge>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Realizado em {new Date(order.createdAt).toLocaleDateString("pt-BR")} às {new Date(order.createdAt).toLocaleTimeString("pt-BR")}
              </p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-10">

            <div className="md:col-span-2">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-4">Itens do Pedido</h2>
              <ul className="divide-y divide-gray-200 dark:divide-zinc-800 border-t border-b border-gray-200 dark:border-zinc-800">
                {order.items?.map((item: OrderItem) => (
                  <li key={item.id} className="py-4 flex items-center">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100 dark:border-zinc-700">
                      <Image
                        src="https://placehold.co/100"
                        alt={item.product_name || "Produto"}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {item.product_name || `Produto ID: ${item.product_id}`}
                      </h3>
                      <p className="text-gray-500 text-sm">Quant: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatPrice(item.price_at_purchase)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Endereço de Entrega
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-zinc-800 p-4 rounded-md">
                <p className="font-medium text-gray-900 dark:text-white">Endereço Principal</p>
                <p>Verifique o cadastro de endereço.</p>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Pagamento
              </h2>
              <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-md">
                <div className="flex justify-between py-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Método</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {order.paymentMethod?.replace('_', ' ') || "Cartão"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-t border-gray-200 dark:border-zinc-700 mt-2 pt-2">
                  <span className="text-base font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-base font-bold text-blue-600">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
