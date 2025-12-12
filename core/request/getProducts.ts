import { UpApiContextRequest, type ApiResponse } from "../apiContext/UpApiContextRequest";

export interface ProductResponse {
    id: string;
    createdAt: string;
    active: boolean;
    categoryId: string;
    name: string;
    description?: string;
    sku: string;
    price: number;
    perishable: boolean;
}

export async function getProducts(tenantId: string): Promise<ApiResponse<ProductResponse[]>> {
    const response = await UpApiContextRequest.get<ApiResponse<ProductResponse[]>>(`/tenants/${tenantId}/products`);
    
    return response.data;
}