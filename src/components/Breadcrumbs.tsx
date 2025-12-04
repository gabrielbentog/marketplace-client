"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  lastItemLabel?: string;
  className?: string;
}

const routeMap: Record<string, string> = {
  products: "Produtos",
  cart: "Carrinho",
  checkout: "Finalizar Compra",
  orders: "Meus Pedidos",
  profile: "Meu Perfil",
  "my-products": "Gerenciar Anúncios",
  new: "Novo",
  edit: "Editar",
  success: "Sucesso",
};

// NOVO: Define pais "artificiais" para rotas soltas
const virtualHierarchy: Record<string, string> = {
  "/checkout": "/cart/checkout", // Faz o checkout parecer filho do carrinho
};

export function Breadcrumbs({ lastItemLabel, className }: BreadcrumbsProps) {
  const pathname = usePathname();

  // 1. Se a rota tiver um pai virtual, usamos ele. Senão, usa a rota real.
  const effectivePath = virtualHierarchy[pathname] || pathname;

  const segments = effectivePath.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm text-muted-foreground mb-6", className)}>
      <ol className="flex items-center space-x-2">

        {/* Home Link */}
        <li>
          <Link href="/" className="flex items-center hover:text-primary transition-colors">
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;

          // Reconstrói o link
          // Ex: em /cart/checkout -> o primeiro segmento vira /cart (que existe!)
          const href = `/${segments.slice(0, index + 1).join("/")}`;

          let label = routeMap[segment] || segment;

          if (segment.length > 20 && !routeMap[segment]) {
            label = isLast && lastItemLabel ? lastItemLabel : "Detalhes";
          }

          return (
            <li key={href} className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground/50" />
              {isLast ? (
                <span className="font-medium text-foreground truncate max-w-[200px]">
                  {lastItemLabel || label}
                </span>
              ) : (
                <Link href={href} className="hover:text-primary transition-colors">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
