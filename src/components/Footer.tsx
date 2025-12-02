import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 dark:bg-zinc-900 dark:border-zinc-800 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Coluna 1 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
              Sobre Nós
            </h3>
            <p className="text-base text-gray-500 dark:text-gray-400">
              O melhor marketplace para encontrar produtos incríveis de vendedores confiáveis em todo o Brasil.
            </p>
          </div>

          {/* Coluna 2 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
              Ajuda
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/products" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Buscar Produtos
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Meu Carrinho
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Meus Pedidos
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
              Venda Conosco
            </h3>
            <p className="text-base text-gray-500 dark:text-gray-400 mb-4">
              Torne-se um vendedor parceiro e alcance milhares de clientes.
            </p>
            <Link href="/register" className="text-base font-medium text-blue-600 hover:text-blue-500">
              Criar conta de vendedor &rarr;
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-gray-400">
            &copy; {new Date().getFullYear()} MarketPlace Inc. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
