"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Dados Mockados (no futuro viriam de uma API)
const BANNERS = [
  {
    id: 1,
    title: "Tecnologia de Ponta",
    description: "Os melhores smartphones e notebooks com preços imperdíveis.",
    image: "https://placehold.co/1920x600/1e293b/ffffff?text=Tech+Week",
    link: "/products?search=smartphone",
    cta: "Ver Ofertas"
  },
  {
    id: 2,
    title: "Renove seu Estilo",
    description: "Nova coleção de moda verão com descontos de até 50%.",
    image: "https://placehold.co/1920x600/4f46e5/ffffff?text=Moda+Verao",
    link: "/products?search=roupa",
    cta: "Conferir Coleção"
  },
  {
    id: 3,
    title: "Casa & Decoração",
    description: "Deixe seu lar mais aconchegante com nossa seleção especial.",
    image: "https://placehold.co/1920x600/059669/ffffff?text=Casa+Decor",
    link: "/products?search=casa",
    cta: "Decorar Agora"
  }
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  // Rotação automática
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((curr) => (curr === 0 ? BANNERS.length - 1 : curr - 1));
  const next = () => setCurrent((curr) => (curr + 1) % BANNERS.length);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* Imagem de Fundo */}
          <Image
            src={BANNERS[current].image}
            alt={BANNERS[current].title}
            fill
            className="object-cover opacity-60"
            priority
          />

          {/* Gradiente para texto legível */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Conteúdo Centralizado */}
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <div className="max-w-4xl space-y-6 z-10">
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-lg"
              >
                {BANNERS[current].title}
              </motion.h2>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-lg md:text-2xl text-gray-100 drop-shadow-md max-w-2xl mx-auto"
              >
                {BANNERS[current].description}
              </motion.p>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Link href={BANNERS[current].link}>
                  <Button size="lg" className="rounded-full px-8 text-lg shadow-xl bg-white text-black hover:bg-gray-100 border-none">
                    {BANNERS[current].cta}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controles Laterais */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all hover:scale-110 z-20 hidden md:block">
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all hover:scale-110 z-20 hidden md:block">
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Indicadores de Página */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current ? "bg-white w-8" : "bg-white/40 w-2 hover:bg-white/60"
            }`}
            aria-label={`Ir para slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
