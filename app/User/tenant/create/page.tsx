"use client";

import React from "react";
import { useState, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import {
  createTenantUser,
  type CreateTenantUserRequest,
} from "../../../../core/request/createTenantUser";

const TENANT_STORAGE_KEY = "active_tenant_id";

interface FormData {
  firstName: string;
  lastName: string;
  document: string;
  email: string;
  password: string;
}

export default function CreateTenantUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    document: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    try {
      const storedTenantId = localStorage.getItem(TENANT_STORAGE_KEY);
      if (storedTenantId) {
        setTenantId(storedTenantId);
      } else {
        setError(
          "ID do Tenant ativo não encontrado. Por favor, selecione um Tenant."
        );
        toast.error("ID do Tenant Ausente", {
          description: "Não foi possível identificar o Tenant para o cadastro.",
        });
      }
    } catch (e) {
      console.error("Erro ao acessar localStorage:", e);
      setError("Erro ao acessar o armazenamento local.");
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!tenantId || error) {
        toast.error("Erro de Cadastro", {
          description: "O ID do Tenant não está disponível.",
        });
        return;
      }

      setLoading(true);

      const requestData: CreateTenantUserRequest = {
        ...formData,
        tenantId: tenantId,
      };

      try {
        const result = await createTenantUser(requestData);

        if (result.success) {
          toast.success("Usuário Tenant criado com sucesso.", {
            description: "Redirecionando para a lista de usuários.",
          });

          router.push("/user/tenant");
        } else {
          toast.warning("Falha no cadastro.", {
            description:
              result.message || "Verifique os dados e tente novamente.",
          });
        }
      } catch (error) {
        console.error("Erro ao tentar cadastrar:", error);
        toast.error("Erro de Conexão.", {
          description:
            "Não foi possível conectar com a API ou houve um erro inesperado.",
        });
      } finally {
        setLoading(false);
      }
    },
    [formData, tenantId, error, router]
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md p-8 shadow-xl border border-border">
          <CardTitle className="text-red-600">Erro de Configuração</CardTitle>
          <CardContent className="mt-4 p-0">
            <p>{error}</p>
            <Button onClick={() => router.push("/")} className="mt-4">
              Voltar para Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8 shadow-xl border border-border space-y-8">
        <CardContent className="p-0">
          <div className="text-center space-y-2 mb-6">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              Cadastrar Usuário Tenant
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Tenant ID Ativo: **
              {tenantId ? tenantId.substring(0, 8) + "..." : "Carregando..."}**
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-sm font-medium text-foreground"
                >
                  Primeiro Nome
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Digite o primeiro nome"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-sm font-medium text-foreground"
                >
                  Sobrenome
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Digite o sobrenome"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="document"
                  className="text-sm font-medium text-foreground"
                >
                  Documento
                </Label>
                <Input
                  id="document"
                  name="document"
                  type="text"
                  placeholder="CPF ou CNPJ"
                  value={formData.document}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>

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
                  placeholder="usuario@tenant.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>

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
                  placeholder="Digite uma senha"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !tenantId}
              className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
            >
              {loading ? "Cadastrando..." : "Cadastrar Usuário Tenant"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground pt-4">
            <Link
              href="/user/tenant"
              className="text-primary hover:text-primary/90 font-medium transition-colors"
            >
              Voltar para a lista de usuários
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
