"use client";

import { Sidebar } from "@/components/template/Sidebar";
import * as React from "react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

const TENANTS_STORAGE_KEY = "user_tenant_ids";

export default function HomePage() {
  const [userTenantIds, setUserTenantIds] = React.useState<string[]>([]);
  const pathname = usePathname();

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

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar tenantIds={userTenantIds} />

      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p className="text-muted-foreground mb-4">
          Bem-vindo! O Tenant ativo é:
          <span className="font-semibold text-foreground ml-1">
            {localStorage.getItem("active_tenant_id") || "Nenhum Selecionado"}
          </span>
        </p>

        <div className="border border-dashed p-10 rounded-lg h-[400px] flex items-center justify-center text-muted-foreground"></div>
      </main>
    </div>
  );
}
