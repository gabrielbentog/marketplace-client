import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

// Apenas uma chave de cookie agora
export const AUTH_COOKIE_NAME = 'gm_auth_token';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função para salvar o token (agora lidamos com o header Authorization)
export const setAuthToken = (token: string) => {
  if (token) {
    Cookies.set(AUTH_COOKIE_NAME, token, { expires: 7 }); // 7 dias
  }
};

export const removeAuthToken = () => {
  Cookies.remove(AUTH_COOKIE_NAME);
};

// --- Interceptor de Requisição ---
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = Cookies.get(AUTH_COOKIE_NAME);
    
    if (token) {
      // O padrão geralmente é "Bearer eyJ..."
      // Se o seu backend mandar só o token no header, a gente ajusta aqui.
      // Vou assumir que o header Authorization já vem completo ou você precisa prefixar.
      // Se o backend retorna "Bearer ..." no header, salvamos tudo.
      config.headers['Authorization'] = token;
    }
  }
  return config;
});

// --- Interceptor de Resposta ---
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Captura o header Authorization se ele vier na resposta (login/refresh)
    // Nota: Headers são case-insensitive no axios, mas acessamos via minúsculo por padrão
    const authHeader = response.headers['authorization']; 
    
    if (authHeader) {
      setAuthToken(authHeader);
    }
    
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
         // Opcional: lógica de logout automático
         // removeAuthToken();
         // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;