import { UpApiContextRequest, type ApiResponse } from "../apiContext/UpApiContextRequest";

export interface CreateCategoryRequest{
    name: string;
    description: string;
    tenantId: string;
}

export async function createCategory(data: CreateCategoryRequest): Promise<ApiResponse<boolean>> {
    const response = await UpApiContextRequest.post<ApiResponse<boolean>>('/products/categories', data);
    
    return response.data;
}