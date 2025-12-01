import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CheckCircle, Package, Home } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 dark:bg-black px-4">
      <div className="text-center max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Pedido Confirmado!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Obrigado pela sua compra. Já estamos processando seu pedido e enviaremos atualizações por e-mail.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/orders" className="w-full">
            <Button className="w-full" size="lg">
              <Package className="mr-2 h-4 w-4" />
              Ver Meus Pedidos
            </Button>
          </Link>

          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Voltar para a Loja
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
