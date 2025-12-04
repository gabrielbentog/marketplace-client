"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/types";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ProductFiltersProps {
  categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helpers para ler estado atual da URL
  const currentCategory = searchParams.get("category_id");
  const currentSort = searchParams.get("sort");
  const onlyInStock = searchParams.get("in_stock") === "true";

  // Função genérica para atualizar URL mantendo outros parâmetros
  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reseta para página 1 ao filtrar
    params.set("page", "1");

    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      {/* Seção de Ordenação */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Ordenar por</h3>
        <div className="space-y-2">
          {[
            { label: "Mais Recentes", value: "created_at_desc" }, // Ajuste conforme seu backend
            { label: "Menor Preço", value: "price_asc" },
            { label: "Maior Preço", value: "price_desc" },
            { label: "Nome (A-Z)", value: "name_asc" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => updateFilter("sort", option.value)}
              className={cn(
                "flex items-center w-full text-sm px-2 py-1.5 rounded-md transition-colors",
                currentSort === option.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {currentSort === option.value && <Check className="w-3 h-3 mr-2" />}
              <span className={cn(currentSort !== option.value && "pl-5")}>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Seção de Estoque */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Disponibilidade</h3>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => updateFilter("in_stock", e.target.checked ? "true" : null)}
            className="rounded border-input text-primary focus:ring-primary w-4 h-4"
          />
          <span className="text-sm text-muted-foreground">Apenas em estoque</span>
        </label>
      </div>

      {/* Seção de Categorias */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Categorias</h3>
        <div className="space-y-1">
          <button
            onClick={() => updateFilter("category_id", null)}
            className={cn(
              "block w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors",
              !currentCategory
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            Todas as categorias
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter("category_id", cat.id)}
              className={cn(
                "block w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors",
                currentCategory === cat.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Botão Limpar Tudo */}
      {(currentCategory || currentSort || onlyInStock) && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => router.push("/products")}
        >
          Limpar Filtros
        </Button>
      )}
    </div>
  );
}
