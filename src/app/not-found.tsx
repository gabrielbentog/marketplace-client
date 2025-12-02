import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50 dark:bg-black px-4 text-center">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
            <AlertTriangle className="h-10 w-10 text-yellow-600 dark:text-yellow-500" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Página não encontrada
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Desculpe, não conseguimos encontrar o que você está procurando. O link pode estar quebrado ou a página foi removida.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              Voltar para Home
            </Button>
          </Link>
          <Link href="/products" className="w-full sm:w-auto">
            <Button className="w-full">
              Explorar Produtos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
