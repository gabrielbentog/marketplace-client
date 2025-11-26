"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";
import { AuthService } from "@/services/auth";
import { AUTH_COOKIE_NAME } from "@/lib/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (credentials: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificação Simplificada
    const token = Cookies.get(AUTH_COOKIE_NAME);
    const storedUser = AuthService.getUserFromStorage();

    if (token && storedUser) {
      setUser(storedUser);
    } else if (!token && storedUser) {
      AuthService.logout();
      setUser(null);
    }
    
    setIsLoading(false);
  }, []);
  
  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const user = await AuthService.login(credentials);
      setUser(user);
      router.push("/");
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    try {
      const user = await AuthService.register(credentials);
      setUser(user);
      router.push("/");
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);