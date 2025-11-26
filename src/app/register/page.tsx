"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

// Schema de validação mais robusto para cadastro
const registerSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth(); // Renomeando para não conflitar com o register do hook-form
  const [serverError, setServerError] = useState("");
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setServerError("");
    try {
      // Chamamos apenas os dados que a API espera (name, email, password)
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
    } catch (error: any) {
      if (error.response?.status === 422) {
        setServerError("Dados inválidos. Verifique se o e-mail já está em uso.");
      } else {
        setServerError("Ocorreu um erro ao criar a conta. Tente novamente.");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-12 dark:bg-zinc-900 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
          Crie sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Comece a comprar e vender hoje mesmo
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              label="Nome completo"
              type="text"
              {...register("name")}
              error={errors.name?.message}
              autoComplete="name"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <Input
              label="Endereço de e-mail"
              type="email"
              {...register("email")}
              error={errors.email?.message}
              autoComplete="email"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <Input
              label="Senha"
              type="password"
              {...register("password")}
              error={errors.password?.message}
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </div>

          <div>
            <Input
              label="Confirme sua senha"
              type="password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
              placeholder="••••••••"
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
              Criar conta
            </Button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="font-semibold leading-6 text-blue-600 hover:text-blue-500"
          >
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}