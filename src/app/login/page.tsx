"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

// Schema de validação
const loginSchema = z.object({
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // Narrow unknown error shapes to check for response.status
  function isApiError(err: unknown): err is { response?: { status?: number } } {
    return (
      typeof err === "object" &&
      err !== null &&
      "response" in err &&
      typeof (err as Record<string, unknown>).response === "object"
    );
  }

  const onSubmit = async (data: LoginForm) => {
    setServerError("");
    try {
      await login(data);
    } catch (error: unknown) {
      // Tratamento básico de erro da API
      if (isApiError(error) && error.response?.status === 401) {
        setServerError("E-mail ou senha incorretos.");
      } else {
        setServerError("Ocorreu um erro ao entrar. Tente novamente.");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-12 dark:bg-zinc-900 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
          Entre na sua conta
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              label="Endereço de e-mail"
              type="email"
              {...register("email")}
              error={errors.email?.message}
              autoComplete="email"
            />
          </div>

          <div>
            <Input
              label="Senha"
              type="password"
              {...register("password")}
              error={errors.password?.message}
              autoComplete="current-password"
            />
          </div>

          {serverError && (
            <div className="text-sm text-red-500 text-center bg-red-50 p-2 rounded border border-red-200">
              {serverError}
            </div>
          )}

          <div>
            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
            >
              Entrar
            </Button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          Não tem uma conta?{" "}
          <Link
            href="/register"
            className="font-semibold leading-6 text-blue-600 hover:text-blue-500"
          >
            Registre-se gratuitamente
          </Link>
        </p>
      </div>
    </div>
  );
}