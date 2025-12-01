"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function CartPage() {
  const { cart, isLoading, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold">Faça login para ver seu carrinho</h2>
        <Link href="/login" className="mt-4"><Button>Entrar</Button></Link>
      </div>
    );
  }

  // CORRIGIDO: Verifica cartItems (camelCase)
  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Seu carrinho está vazio</h2>
        <p className="text-gray-500 mb-6 mt-2">Nenhum item encontrado.</p>
        <Link href="/">
          <Button variant="outline">Continuar comprando</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Meu Carrinho</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
          <section className="lg:col-span-7">
            <ul className="border-t border-b border-gray-200 divide-y divide-gray-200 dark:border-zinc-800 dark:divide-zinc-800">
              {/* CORRIGIDO: Itera sobre cartItems */}
              {cart.cartItems.map((item) => {
                const product = item.product;
                // Proteção caso product venha nulo (embora seu JSON mostre que vem)
                if (!product) return null;

                const image = product.images?.[0]?.url || "https://placehold.co/150";

                return (
                  <li key={item.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <div className="relative w-24 h-24 rounded-md overflow-hidden bg-gray-100">
                        <Image src={image} alt={product.name} fill className="object-cover" />
                      </div>
                    </div>

                    <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 dark:text-white">
                            <Link href={`/products/${product.id}`}>{product.name}</Link>
                          </h3>
                          <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-300">
                            {formatPrice(product.price)}
                          </p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <div className="flex items-center border border-gray-300 rounded-md max-w-[100px]">
                            <button className="p-2" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="flex-1 text-center text-sm">{item.quantity}</span>
                            <button className="p-2" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="absolute top-0 right-0 p-2 text-gray-400 hover:text-red-500">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Resumo */}
          <section className="mt-16 bg-white rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5 border border-gray-200 dark:bg-zinc-900 dark:border-zinc-800">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Resumo</h2>
            <div className="mt-6 flex justify-between border-t pt-4">
              <dt className="text-base font-medium">Total</dt>
              <dd className="text-base font-medium">{formatPrice(cartTotal)}</dd>
            </div>
            <div className="mt-6">
              <Link href="/checkout">
                <Button className="w-full" size="lg">Finalizar Compra</Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
