"use client";

import type React from "react";
import { useState, useCallback, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import {
  createUser,
  type CreateUserRequest,
} from "../../../core/request/createUser";

interface FormData extends CreateUserRequest {}

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    document: "",
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
        const result = await createUser(formData);

        if (result.success) {
          toast.success("Usuário criado com sucesso.", {
            description: "Bem-vindo à Up Brasil!",
          });

          setFormData({
            firstName: "",
            lastName: "",
            document: "",
            email: "",
            password: "",
          });
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
    [formData]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8 shadow-xl border border-border space-y-8">
        <CardContent className="p-0">
          {" "}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              Up Brasil
            </h1>
            <p className="text-muted-foreground text-sm">
              Crie sua conta preenchendo os campos abaixo
            </p>
          </div>
          {/* Form */}
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
                  placeholder="Digite seu primeiro nome"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>

              {/* Sobrenome */}
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
                  placeholder="Digite seu sobrenome"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>

              {/* Documento */}
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
                  placeholder="Digite uma senha segura"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
            >
              {loading ? "Cadastrando..." : "Criar Conta"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground pt-4">
            Já tem uma conta?
            <Link
              href="/User/SignIn"
              className="text-primary hover:text-primary/90 font-medium transition-colors"
            >
              Fazer login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
