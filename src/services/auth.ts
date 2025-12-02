import { api, setAuthToken, removeAuthToken, AUTH_COOKIE_NAME } from "@/lib/api";
import { User } from "@/types";
import Cookies from "js-cookie";

const STORAGE_KEY = "gm_user_data";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// 1. Criamos uma interface flexível para a resposta da API
interface AuthResponse {
  user?: User;
  data?: {
    user?: User;
  };
  // Index signature permite acessar outras propriedades se a resposta for o próprio User
  [key: string]: unknown;
}

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    // 2. Tipamos o retorno do axios com nossa interface
    const response = await api.post<AuthResponse>("/api/authenticate", {
      authentication: credentials,
    });

    const authHeader = response.headers['authorization'];

    if (authHeader) {
      setAuthToken(authHeader);
    } else {
      console.warn("Atenção: Header 'Authorization' não encontrado.");
    }

    const data = response.data;

    // 3. Lógica de extração segura sem 'any'
    // Tenta pegar data.user, depois data.data.user, e por fim assume que 'data' é o próprio User
    const user = data.user || data.data?.user || (data as unknown as User);

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }

    return user;
  },

  register: async (credentials: RegisterCredentials): Promise<User> => {
    const response = await api.post<AuthResponse>("/api/users", {
      user: credentials,
    });

    const authHeader = response.headers['authorization'];

    if (authHeader) {
      setAuthToken(authHeader);
    }

    const data = response.data;

    // Mesma lógica de extração aqui
    const user = data.user || data.data?.user || (data as unknown as User);

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }

    return user;
  },

  logout: () => {
    removeAuthToken();
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    window.location.href = "/login";
  },

  getUserFromStorage: (): User | null => {
    if (typeof window === "undefined") return null;

    // Verifica se o Cookie de autenticação ainda existe
    const token = Cookies.get(AUTH_COOKIE_NAME);

    if (!token) {
      return null;
    }

    const userStr = localStorage.getItem(STORAGE_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  updateProfile: async (id: string, data: { name?: string; email?: string; password?: string }) => {
    const response = await api.patch(`/api/users/${id}`, { user: data });

    // Atualiza o cookie/storage com os novos dados se for o próprio usuário
    const updatedUser = response.data.data || response.data; // Ajuste conforme retorno
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    }
    return updatedUser;
  },
};
