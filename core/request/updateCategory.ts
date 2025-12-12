import { UpApiContextRequest, type ApiResponse } from "../apiContext/UpApiContextRequest";

export interface UpdateCategoryRequest{
    name: string;
    description: string;
    id: string;
}

export async function updateCategory(data: UpdateCategoryRequest): Promise<ApiResponse<boolean>> {
    const response = await UpApiContextRequest.put<ApiResponse<boolean>>('/products/categories', data);
    
    return response.data;
}