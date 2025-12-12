"use client";

import React, { useState, useCallback, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

import {
  createCategory,
  type CreateCategoryRequest,
} from "../../../core/request/createCategory";
import {
  updateCategory,
  type UpdateCategoryRequest,
} from "../../../core/request/updateCategory";
import {
  getCategories,
  type CategoryResponse,
} from "../../../core/request/getCategories";

const TENANT_STORAGE_KEY = "active_tenant_id";

interface FormData {
  id?: string;
  name: string;
  description: string;
}

interface CategoryFormPageProps {
  initialCategoryId?: string;
}

export default function CategoryFormPage({
  initialCategoryId,
}: CategoryFormPageProps) {
  const router = useRouter();
  const categoryId = initialCategoryId;
  const isEditMode = !!categoryId;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  const fetchAndFilterCategories = useCallback(
    async (id: string, tenantId: string) => {
      try {
        setInitialLoading(true);

        const response = await getCategories(tenantId);

        if (response.data) {
          const foundCategory = response.data.find((cat) => cat.id === id);

          if (foundCategory) {
            setFormData({
              id: foundCategory.id,
              name: foundCategory.name,
              description: foundCategory.description || "",
            });
          } else {
            setError("Categoria não encontrada na lista.");
          }
        } else {
          setError(response.message || "Erro ao carregar lista de categorias.");
        }
      } catch (err) {
        setError("Erro ao carregar dados da categoria.");
      } finally {
        setInitialLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (isEditMode && categoryId) {
      const tenantId = localStorage.getItem(TENANT_STORAGE_KEY);

      if (!tenantId) {
        setError("ID do Tenant não encontrado. Impossível carregar dados.");
        setInitialLoading(false);
        return;
      }

      fetchAndFilterCategories(categoryId, tenantId);
    } else if (!isEditMode) {
      // Se for modo de criação, garante que não está carregando dados iniciais
      setInitialLoading(false);
    }
  }, [categoryId, isEditMode, fetchAndFilterCategories]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);

      const tenantId = localStorage.getItem(TENANT_STORAGE_KEY);

      if (!tenantId) {
        toast.error("Erro de Autenticação.", {
          description: "ID do Tenant não encontrado.",
        });
        setLoading(false);
        return;
      }

      try {
        let result: { success: boolean; message?: string };
        let categoryName = formData.name;

        if (isEditMode && formData.id) {
          const updateData: UpdateCategoryRequest = {
            id: formData.id,
            name: formData.name,
            description: formData.description,
          };
          result = await updateCategory(updateData);
        } else {
          const createData: CreateCategoryRequest = {
            tenantId: tenantId,
            name: formData.name,
            description: formData.description,
          };
          result = await createCategory(createData);
        }

        if (result.success) {
          toast.success(
            isEditMode
              ? "Categoria atualizada com sucesso!"
              : "Categoria cadastrada com sucesso!",
            {
              description: `Categoria '${categoryName}' salva.`,
            }
          );
          router.push("/categories");
        } else {
          toast.warning("Falha ao salvar.", {
            description:
              result.message || "Verifique os dados e tente novamente.",
          });
        }
      } catch (error) {
        toast.error("Erro de Conexão.", {
          description:
            "Não foi possível conectar com a API ou houve um erro inesperado.",
        });
      } finally {
        setLoading(false);
      }
    },
    [formData, router, isEditMode]
  );

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-orange-500" />
        <p className="text-lg text-muted-foreground">Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button className="mt-4" onClick={() => router.push("/categories")}>
              Voltar para a Lista
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-lg p-6 shadow-xl border border-border space-y-6">
        <CardHeader className="p-0">
          <div className="text-center space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              {isEditMode ? "Editar Categoria" : "Nova Categoria"}
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {isEditMode
                ? "Ajuste os dados da categoria existente."
                : "Preencha os dados para criar uma nova categoria."}
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground"
                >
                  Nome da Categoria
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Ex: Eletrônicos, Roupas"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-foreground"
                >
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Breve descrição sobre a categoria"
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
            >
              {loading
                ? isEditMode
                  ? "Atualizando..."
                  : "Cadastrando..."
                : isEditMode
                ? "Salvar Alterações"
                : "Cadastrar Categoria"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground pt-4">
            <Link
              href="/categories"
              className="text-primary hover:text-primary/90 font-medium transition-colors flex items-center justify-center"
            >
              &larr; Voltar para a Lista de Categorias
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
