import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas que exigem autenticação
const protectedRoutes = [
  "/cart",
  "/checkout",
  "/orders",
  "/my-products",
  "/products/new",
  "/profile",
];

// Rotas exclusivas de autenticação (se já estiver logado, não deve acessar)
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("gm_auth_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Se tentar acessar rota protegida sem token -> Login
  // Verifica se o caminho atual começa com alguma das rotas protegidas
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    // Podemos adicionar ?callbackUrl=... para redirecionar de volta depois
    return NextResponse.redirect(loginUrl);
  }

  // 2. Se tentar acessar login/register já tendo token -> Home
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configura em quais caminhos o middleware roda (para não rodar em imagens, api, etc)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
