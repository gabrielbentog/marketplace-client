import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "sonner";
import { CartProvider } from "@/contexts/CartContext";
import { Footer } from "@/components/Footer"; // <--- Importação do Footer adicionada

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | MarketPlace", // %s será substituído pelo título de cada página
    default: "MarketPlace - Compre e Venda Online", // Título da Home se não definido
  },
  description: "Encontre os melhores produtos eletrônicos, roupas e muito mais com vendedores verificados.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://seu-marketplace.com.br",
    siteName: "MarketPlace",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-black`}>
        <AuthProvider>
          <CartProvider>
            {/* Wrapper Flex para empurrar o footer para baixo */}
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>

            {/* Componente Toaster adicionado para exibir os alertas */}
            <Toaster position="top-right" richColors />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
