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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createProduct,
  type CreateProductRequest,
} from "../../../core/request/createProduct";
import {
  updateProduct,
  type UpdateProductRequest,
} from "../../../core/request/updateProduct";
import {
  getProducts,
  type ProductResponse,
} from "../../../core/request/getProducts";
import {
  getCategories,
  type CategoryResponse,
} from "../../../core/request/getCategories";

const TENANT_STORAGE_KEY = "active_tenant_id";

interface ProductFormData {
  id?: string;
  productCategoryId: string;
  name: string;
  description: string;
  sku: string;
  price: number | string;
  perishable: boolean;
}

interface ProductFormPageProps {
  initialProductId?: string;
}

export default function ProductFormPage({
  initialProductId,
}: ProductFormPageProps) {
  const router = useRouter();
  const productId = initialProductId;
  const isEditMode = !!productId;

  const [formData, setFormData] = useState<ProductFormData>({
    productCategoryId: "",
    name: "",
    description: "",
    sku: "",
    price: "",
    perishable: false,
  });
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(
    async (tenantId: string) => {
      try {
        const response = await getCategories(tenantId);

        const categoriesData = response.data;

        if (categoriesData) {
          setCategories(categoriesData);

          if (!isEditMode && categoriesData.length > 0) {
            setFormData((prev) => ({
              ...prev,
              productCategoryId: categoriesData[0].id,
            }));
          }
        } else {
          setError(response.message || "Erro ao carregar lista de categorias.");
        }
      } catch (err) {
        setError("Erro ao carregar dados de categorias.");
      }
    },
    [isEditMode]
  );

  const fetchProductData = useCallback(
    async (id: string, tenantId: string) => {
      try {
        await fetchCategories(tenantId);

        const response = await getProducts(tenantId);

        if (response.data) {
          const foundProduct = response.data.find((prod) => prod.id === id);

          if (foundProduct) {
            setFormData({
              id: foundProduct.id,
              productCategoryId: (foundProduct as any).categoryId,
              name: foundProduct.name,
              description: foundProduct.description || "",
              sku: foundProduct.sku,
              price: foundProduct.price.toString(),
              perishable: foundProduct.perishable,
            });
          } else {
            setError("Produto não encontrado na lista.");
          }
        } else {
          setError(response.message || "Erro ao carregar lista de produtos.");
        }
      } catch (err) {
        setError("Erro ao carregar dados do produto.");
      } finally {
        setInitialLoading(false);
      }
    },
    [fetchCategories]
  );

  useEffect(() => {
    const tenantId = localStorage.getItem(TENANT_STORAGE_KEY);
    if (!tenantId) {
      setError("ID do Tenant não encontrado. Impossível carregar dados.");
      setInitialLoading(false);
      return;
    }

    if (isEditMode && productId) {
      fetchProductData(productId, tenantId);
    } else {
      fetchCategories(tenantId);
      setInitialLoading(false);
    }
  }, [productId, isEditMode, fetchProductData, fetchCategories]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleCheckboxChange = useCallback((checked: boolean) => {
    setFormData((prev) => ({ ...prev, perishable: checked }));
  }, []);

  const handleSelectChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, productCategoryId: value }));
  }, []);

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

      const priceValue = parseFloat(formData.price.toString());

      if (isNaN(priceValue) || priceValue < 0) {
        toast.warning("Dados inválidos.", {
          description: "O preço deve ser um número válido e positivo.",
        });
        setLoading(false);
        return;
      }

      try {
        let result: { success: boolean; message?: string };
        let productName = formData.name;

        if (isEditMode && formData.id) {
          const updateData: UpdateProductRequest = {
            id: formData.id,
            tenantId: tenantId,
            productCategoryId: formData.productCategoryId,
            name: formData.name,
            description: formData.description,
            sku: formData.sku,
            price: priceValue,
            perishable: formData.perishable,
          };
          result = await updateProduct(updateData);
        } else {
          const createData: CreateProductRequest = {
            tenantId: tenantId,
            productCategoryId: formData.productCategoryId,
            name: formData.name,
            description: formData.description,
            sku: formData.sku,
            price: priceValue,
            perishable: formData.perishable,
          };
          result = await createProduct(createData);
        }

        if (result.success) {
          toast.success(
            isEditMode
              ? "Produto atualizado com sucesso!"
              : "Produto cadastrado com sucesso!",
            {
              description: `Produto '${productName}' salvo.`,
            }
          );
          router.push("/products");
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
            <Button className="mt-4" onClick={() => router.push("/products")}>
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
              {isEditMode ? "Editar Produto" : "Novo Produto"}
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {isEditMode
                ? "Ajuste os dados do produto existente."
                : "Preencha os dados para criar um novo produto."}
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
                  Nome do Produto
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Ex: Smartphone X, Camiseta P"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="sKU"
                  className="text-sm font-medium text-foreground"
                >
                  SKU (Stock Keeping Unit)
                </Label>
                <Input
                  id="sku"
                  name="sku"
                  type="text"
                  placeholder="Ex: SMAR-X-PRT-001"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="price"
                  className="text-sm font-medium text-foreground"
                >
                  Preço
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 99.99"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>

              {/* CAMPO SELECT PARA CATEGORIAS */}
              <div className="space-y-2">
                <Label
                  htmlFor="productCategoryId"
                  className="text-sm font-medium text-foreground"
                >
                  Categoria
                </Label>
                <Select
                  value={formData.productCategoryId}
                  onValueChange={handleSelectChange}
                  disabled={categories.length === 0}
                >
                  <SelectTrigger id="productCategoryId" className="h-11">
                    <SelectValue
                      placeholder={
                        categories.length > 0
                          ? "Selecione uma categoria"
                          : "Nenhuma categoria encontrada"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {categories.length === 0 && (
                  <p className="text-xs text-red-500">
                    Nenhuma categoria encontrada. Certifique-se de cadastrar
                    categorias primeiro.
                  </p>
                )}
              </div>
              {/* FIM CAMPO SELECT */}

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
                  placeholder="Detalhes sobre o produto, material, especificações..."
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="perishable"
                  checked={formData.perishable}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(checked === true)
                  }
                />
                <Label
                  htmlFor="perishable"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Produto Perecível
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={
                loading ||
                categories.length === 0 ||
                !formData.productCategoryId
              }
              className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
            >
              {loading
                ? isEditMode
                  ? "Atualizando..."
                  : "Cadastrando..."
                : isEditMode
                ? "Salvar Alterações"
                : "Cadastrar Produto"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground pt-4">
            <Link
              href="/products"
              className="text-primary hover:text-primary/90 font-medium transition-colors flex items-center justify-center"
            >
              &larr; Voltar para a Lista de Produtos
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
