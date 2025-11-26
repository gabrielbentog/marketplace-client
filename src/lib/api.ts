import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

// Chaves dos Cookies
const AUTH_COOKIES = {
  ACCESS_TOKEN: 'gm_access-token',
  CLIENT: 'gm_client',
  UID: 'gm_uid',
  EXPIRY: 'gm_expiry',
  TOKEN_TYPE: 'gm_token-type'
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Defina isso no .env.local
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptor de Requisição ---
// Injeta os tokens automaticamente em toda chamada
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Nota: js-cookie só funciona no Client-Side. 
  // Para Server Components, faremos uma função auxiliar separada.
  if (typeof window !== 'undefined') {
    const accessToken = Cookies.get(AUTH_COOKIES.ACCESS_TOKEN);
    const client = Cookies.get(AUTH_COOKIES.CLIENT);
    const uid = Cookies.get(AUTH_COOKIES.UID);
    const tokenType = Cookies.get(AUTH_COOKIES.TOKEN_TYPE);

    if (accessToken) config.headers['access-token'] = accessToken;
    if (client) config.headers['client'] = client;
    if (uid) config.headers['uid'] = uid;
    if (tokenType) config.headers['token-type'] = tokenType;
  }
  return config;
});

// --- Interceptor de Resposta ---
// Atualiza os tokens se o backend mandar novos (rotação de token)
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const headers = response.headers;
    
    // O Devise às vezes retorna novos headers para manter a sessão viva
    if (headers['access-token']) {
      Cookies.set(AUTH_COOKIES.ACCESS_TOKEN, headers['access-token']);
      Cookies.set(AUTH_COOKIES.CLIENT, headers['client']);
      Cookies.set(AUTH_COOKIES.UID, headers['uid']);
      Cookies.set(AUTH_COOKIES.EXPIRY, headers['expiry']);
      Cookies.set(AUTH_COOKIES.TOKEN_TYPE, headers['token-type'] || 'Bearer');
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Logout forçado se o token for inválido
      // Evita loop de redirect se já estiver na login
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
         // Implementar lógica de logout (limpar cookies e redirecionar)
      }
    }
    return Promise.reject(error);
  }
);

export default api;