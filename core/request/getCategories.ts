import { UpApiContextRequest, type ApiResponse } from "../apiContext/UpApiContextRequest";

export interface CategoryResponse {
    id: string;
    createdAt: string;
    active: boolean;
    name: string;
    description?: string;
}

export async function getCategories(tenantId: string): Promise<ApiResponse<CategoryResponse[]>> {
    const response = await UpApiContextRequest.get<ApiResponse<CategoryResponse[]>>(`/tenants/${tenantId}/products/categories`);
    
    return response.data;
}