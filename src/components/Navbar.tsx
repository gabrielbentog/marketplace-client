"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, User, LogOut, Package, PlusCircle, Menu, X } from "lucide-react";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Mock de contagem do carrinho (substituiremos pelo CartContext em breve)
  const cartItemCount = 0; 

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-zinc-900 dark:border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Lado Esquerdo: Logo e Links Principais */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
                MarketPlace
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink href="/products">Explorar Produtos</NavLink>
              {/* Link exclusivo para Vendedores */}
              {user?.role === 'seller' && (
                <NavLink href="/my-products">Meus Anúncios</NavLink>
              )}
            </div>
          </div>

          {/* Lado Direito: Ações */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {/* Botão de Criar Produto (Apenas Vendedores) */}
            {user?.role === 'seller' && (
              <Link href="/products/new">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Vender
                </Button>
              </Link>
            )}

            {/* Ícone do Carrinho */}
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Menu do Usuário ou Login */}
            {isAuthenticated ? (
              <div className="relative ml-3">
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">Abrir menu de usuário</span>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </button>
                </div>
                
                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-800"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-zinc-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                      <span className="text-xs font-bold text-blue-600 capitalize">{user?.role === 'seller' ? 'Vendedor' : 'Comprador'}</span>
                    </div>
                    
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-700">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" /> Perfil
                      </div>
                    </Link>
                    
                    {user?.role === 'seller' && (
                      <Link href="/my-products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-700">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-2" /> Produtos
                        </div>
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-zinc-700"
                    >
                      <div className="flex items-center">
                        <LogOut className="w-4 h-4 mr-2" /> Sair
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Entrar</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Cadastrar</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Botão Mobile */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Abrir menu principal</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800">
          <div className="pt-2 pb-3 space-y-1">
            <MobileNavLink href="/products">Explorar Produtos</MobileNavLink>
            {user?.role === 'seller' && (
               <MobileNavLink href="/products/new">Vender Produto</MobileNavLink>
            )}
          </div>
          
          {isAuthenticated ? (
            <div className="pt-4 pb-4 border-t border-gray-200 dark:border-zinc-800">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-white">{user?.name}</div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <MobileNavLink href="/profile">Meu Perfil</MobileNavLink>
                <MobileNavLink href="/cart">Carrinho ({cartItemCount})</MobileNavLink>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-4 border-t border-gray-200 dark:border-zinc-800 px-4 space-y-2">
              <Link href="/login" className="block">
                <Button variant="secondary" className="w-full justify-center">Entrar</Button>
              </Link>
              <Link href="/register" className="block">
                <Button className="w-full justify-center">Cadastrar</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

// Subcomponentes para deixar o código mais limpo
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-zinc-800 transition-colors"
    >
      {children}
    </Link>
  );
}