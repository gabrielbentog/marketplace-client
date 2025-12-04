"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { AddressService } from "@/services/address";
import { CheckoutService } from "@/services/checkout";
import { Address } from "@/types";
import { Button } from "@/components/ui/Button";
import { AddressForm } from "@/components/AddressForm";
import { MapPin, CreditCard, CheckCircle, Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/Skeleton";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { cart, cartTotal, clearCart, isLoading: isCartLoading } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isCreatingAddress, setIsCreatingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const data = await AddressService.getAll();
        setAddresses(data);
        if (data.length > 0) {
          setSelectedAddressId((prev) => prev || data[0].id);
        }
      } catch (error) {
        console.error("Erro ao buscar endereços", error);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    if (isAuthenticated) {
      loadAddresses();
    }
  }, [isAuthenticated]);

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.error("Por favor, selecione um endereço de entrega.");
      return;
    }

    setIsProcessing(true);
    try {
      await CheckoutService.processCheckout(selectedAddressId, paymentMethod);
      toast.success("Pedido realizado com sucesso!");
      await clearCart();
      router.push("/orders/success");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao processar o pedido. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading || isCartLoading || (isAuthenticated && isLoadingAddresses)) {
    return (
      <div className="bg-gray-50 dark:bg-black min-h-screen py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800">
                 <Skeleton className="h-8 w-48 mb-4" />
                 <Skeleton className="h-24 w-full rounded-md" />
              </div>
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800">
                 <Skeleton className="h-8 w-48 mb-4" />
                 <div className="grid grid-cols-3 gap-3">
                    <Skeleton className="h-12 rounded-md" />
                    <Skeleton className="h-12 rounded-md" />
                    <Skeleton className="h-12 rounded-md" />
                 </div>
              </div>
            </div>
            <div className="md:col-span-1">
               <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800">
                  <Skeleton className="h-6 w-32 mb-6" />
                  <Skeleton className="h-32 w-full mb-6" />
                  <Skeleton className="h-12 w-full rounded-md" />
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 bg-gray-50 dark:bg-black">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Seu carrinho está vazio</h2>
            <Button onClick={() => router.push("/")}>Voltar para a loja</Button>
        </div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="md:col-span-2 space-y-8">

            {/* Endereço */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-white">
                  <MapPin className="text-blue-600" /> Endereço de Entrega
                </h2>
                {!isCreatingAddress && (
                  <Button variant="ghost" size="sm" onClick={() => setIsCreatingAddress(true)}>
                    <Plus className="w-4 h-4 mr-1" /> Novo Endereço
                  </Button>
                )}
              </div>

              {isCreatingAddress ? (
                <AddressForm
                  onCancel={() => setIsCreatingAddress(false)}
                  onSuccess={(newAddr) => {
                    setAddresses([...addresses, newAddr]);
                    setSelectedAddressId(newAddr.id);
                    setIsCreatingAddress(false);
                  }}
                />
              ) : (
                <div className="space-y-3">
                  {addresses.length === 0 ? (
                    <p className="text-gray-500 italic">Você ainda não tem endereços cadastrados.</p>
                  ) : (
                    addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 border rounded-md cursor-pointer transition-all relative ${
                          selectedAddressId === addr.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-500"
                            : "border-gray-200 hover:border-blue-300 dark:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          {/* CORREÇÃO AQUI: Adicionado pr-8 para evitar overlap com o ícone */}
                          <div className="pr-8">
                            <p className="font-medium text-gray-900 dark:text-white break-words">{addr.street}</p>
                            <p className="text-sm text-gray-500">{addr.city} - {addr.state}, {addr.zipCode}</p>
                          </div>
                          {selectedAddressId === addr.id && (
                            <CheckCircle className="text-blue-600 w-5 h-5 absolute top-4 right-4" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Pagamento (mantém igual) */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 dark:text-white">
                <CreditCard className="text-blue-600" /> Forma de Pagamento
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "credit_card", label: "Cartão de Crédito" },
                  { id: "pix", label: "Pix" },
                  { id: "boleto", label: "Boleto" }
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-3 border rounded-md text-sm font-medium transition-all ${
                      paymentMethod === method.id
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-zinc-800 dark:text-gray-300 dark:border-zinc-600 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Resumo (mantém igual) */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 sticky top-24">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resumo do Pedido</h3>

              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                {cart?.cartItems?.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 truncate w-2/3">
                      {item.quantity}x {item.product?.name || "Produto"}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-zinc-700 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900 dark:text-white">Total a pagar</span>
                  <span className="text-xl font-bold text-blue-600">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <Button
                className="w-full h-12 text-base"
                onClick={handleCheckout}
                isLoading={isProcessing}
                disabled={!selectedAddressId}
              >
                Confirmar Compra
              </Button>

              {!selectedAddressId && (
                <p className="text-xs text-center text-red-500 mt-2">
                  Selecione um endereço para continuar
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
