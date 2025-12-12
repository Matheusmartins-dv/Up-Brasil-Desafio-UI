import { UpApiContextRequest, type ApiResponse } from "../apiContext/UpApiContextRequest";

export async function changeStartuProductCategory(id: string): Promise<ApiResponse<boolean>> {
    const response = await UpApiContextRequest.patch<ApiResponse<boolean>>(`/products/categories/${id}/status`);
    
    return response.data;
}