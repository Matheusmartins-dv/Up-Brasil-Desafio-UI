"use client";

import React from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2, PowerIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  getCategories,
  type CategoryResponse,
} from "../../core/request/getCategories";
import { changeStartuProductCategory } from "../../core/request/changeStartuProductCategory";
import { Sidebar } from "../../components/template/Sidebar";

const TENANT_STORAGE_KEY = "active_tenant_id";
const TENANTS_STORAGE_KEY = "user_tenant_ids";

export default function CategoryListPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userTenantIds, setUserTenantIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    const storedIds = localStorage.getItem(TENANTS_STORAGE_KEY);
    if (storedIds) {
      try {
        const ids = JSON.parse(storedIds) as string[];
        setUserTenantIds(ids);
        if (ids.length === 0) {
          toast.warning("Nenhum Tenant encontrado.", {
            description: "Sua conta pode não ter acessos configurados.",
          });
        }
      } catch (e) {
        console.error("Erro ao parsear tenant IDs:", e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      let tenantId: string | null = null;

      try {
        tenantId = localStorage.getItem(TENANT_STORAGE_KEY);
      } catch (e) {
        console.error("Erro ao acessar localStorage:", e);
        setError(
          "Não foi possível acessar o ID do tenant no armazenamento local."
        );
        setIsLoading(false);
        return;
      }

      if (!tenantId) {
        setError("ID do Tenant não encontrado. Faça login novamente.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await getCategories(tenantId);

        if (response.data) {
          setCategories(response.data);
        } else {
          setError(response.message || "Erro ao carregar categorias.");
        }
      } catch (err) {
        setError(
          "Não foi possível conectar ao servidor ou houve um erro inesperado."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    router.push("/categories/create");
  };

  const handleChangeStatus = async (id: string) => {
    toast.info(`Funcionalidade: Excluir categoria (ID: ${id})`);
    changeStartuProductCategory(id);
    window.location.reload();
  };

  const handleEditCategory = (id: string) => {
    router.push(`/categories/edit/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-orange-500" />
        <p className="text-lg text-muted-foreground">
          Carregando categorias...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Erro ao Carregar</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Componente Sidebar com a prop 'tenantIds' */}
      <Sidebar tenantIds={userTenantIds} />

      {/* Conteúdo Principal (Lista de Categorias) */}
      <div className="flex-1 p-4 md:p-8">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Gestão de Categorias
            </CardTitle>

            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white transition-colors"
              onClick={handleAddCategory}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo
            </Button>
          </CardHeader>

          <CardContent>
            {categories.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <p className="text-lg">Nenhuma categoria cadastrada.</p>
                <p className="text-sm">
                  Clique em "Adicionar Novo" para começar.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Descrição
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Criado Em
                    </TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-semibold">
                        {category.name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-gray-500">
                        {category.description || "Sem descrição"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={category.active ? "default" : "secondary"}
                        >
                          {category.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">
                        {new Date(category.createdAt).toLocaleString("pt-BR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mr-2"
                          onClick={() => handleEditCategory(category.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleChangeStatus(category.id)}
                        >
                          <PowerIcon className="h-4 w-4 " />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
