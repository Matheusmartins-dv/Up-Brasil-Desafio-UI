"use client";

import type React from "react";
import { useState, useCallback, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  signIn,
  type SignInRequest,
  type SignInResponse,
} from "../../../core/request/signIn";
import { isAxiosError } from "axios";

interface FormData extends SignInRequest {}

export default function SignInPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const result = await signIn(formData);

        if (result.success && result.data) {
          const userData: SignInResponse = result.data;

          localStorage.setItem(
            "user_tenant_ids",
            JSON.stringify(userData.tenantIds)
          );

          if (userData.tenantIds.length > 0) {
            localStorage.setItem("active_tenant_id", userData.tenantIds[0]);
          }

          toast.success("Login efetuado com sucesso.", {
            description: `Bem-vindo! ID: ${userData.id}`,
          });

          router.push("/home");
        } else {
          toast.warning("Falha no login.", {
            description: result.message || "E-mail ou senha inválidos.",
          });
        }
      } catch (error) {
        let errorMessage = "Mensagem da API não encontrada ou erro de rede.";

        if (isAxiosError(error)) {
          const apiMessage = error.response?.data?.Message as string;

          if (apiMessage) {
            errorMessage = apiMessage;
          }
        }

        toast.error("Falha ao processar a requisição.", {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    },
    [formData, router]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8 shadow-xl border border-border space-y-8">
        <CardContent className="p-0">
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              Up Brasil
            </h1>
            <p className="text-muted-foreground text-sm">
              Entre com suas credenciais para acessar a plataforma.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  E-mail
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Senha
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>
            </div>

            {/* Botão de Submissão */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground pt-4">
            Não tem uma conta?{" "}
            <Link
              href="/user/create"
              className="text-primary hover:text-primary/90 font-medium transition-colors"
            >
              Cadastre-se aqui
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
