"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { LayoutDashboard, Users, Boxes, Tag } from "lucide-react";

interface SidebarProps {
  tenantIds: string[];
}

const TENANT_STORAGE_KEY = "active_tenant_id";

export function Sidebar({ tenantIds }: SidebarProps) {
  const pathname = usePathname();
  const [activeTenantId, setActiveTenantId] = React.useState<
    string | undefined
  >(undefined);

  React.useEffect(() => {
    const storedTenant = localStorage.getItem(TENANT_STORAGE_KEY);

    if (storedTenant && tenantIds.includes(storedTenant)) {
      setActiveTenantId(storedTenant);
    } else if (tenantIds.length > 0) {
      const defaultTenant = tenantIds[0];
      setActiveTenantId(defaultTenant);
      localStorage.setItem(TENANT_STORAGE_KEY, defaultTenant);
    }
  }, [tenantIds]);

  const handleTenantChange = (tenantId: string) => {
    setActiveTenantId(tenantId);
    localStorage.setItem(TENANT_STORAGE_KEY, tenantId);
  };

  const navItems = [
    { name: "Categorias", href: "/categories", icon: Tag },
    { name: "Produtos", href: "/products", icon: Boxes },
    { name: "Usuários", href: "/user/tenant", icon: Users },
  ];

  return (
    <div className="flex flex-col h-screen w-72 border-r bg-card shadow-lg p-4">
      <div className="mb-6">
        <p className="text-sm font-semibold mb-2 text-muted-foreground">
          Tenant Ativo
        </p>
        <Select
          value={activeTenantId}
          onValueChange={handleTenantChange}
          disabled={!activeTenantId}
        >
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder="Selecione um Tenant" />
          </SelectTrigger>
          <SelectContent>
            {tenantIds.map((id) => (
              <SelectItem key={id} value={id}>
                {id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator className="mb-4" />

      <nav className="space-y-2 flex-grow">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors 
                                ${
                                  isActive
                                    ? "bg-primary text-primary-foreground font-semibold shadow-md"
                                    : "text-foreground hover:bg-muted"
                                }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
