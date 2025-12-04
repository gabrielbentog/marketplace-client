"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Garante que o cliente seja criado apenas uma vez por sessão do navegador
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Os dados serão considerados "velhos" após 1 minuto
        staleTime: 60 * 1000,
        // Se a janela perder o foco e voltar, refaz a busca automaticamente
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
