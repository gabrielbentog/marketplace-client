"use client"; // Erros devem ser Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { RefreshCw, AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Aqui você poderia enviar o erro para um serviço de log (Sentry, etc)
    console.error("Erro capturado pela aplicação:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50 dark:bg-black px-4 text-center">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
            <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-500" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Algo deu errado!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Não foi possível carregar esta página corretamente. Tente recarregar ou volte mais tarde.
        </p>

        <div className="flex flex-col gap-3">
          <Button onClick={() => reset()} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>

          {/* Opcional: Botão para voltar a um lugar seguro */}
          <Button
            variant="outline"
            onClick={() => window.location.href = "/"}
            className="w-full"
          >
            Voltar para Home
          </Button>
        </div>
      </div>
    </div>
  );
}
