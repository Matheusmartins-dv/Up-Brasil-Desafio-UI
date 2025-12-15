import { UpApiContextRequest, type ApiResponse } from "../apiContext/UpApiContextRequest";

export async function deleteProduct(id: string): Promise<ApiResponse<boolean>> {
    const response = await UpApiContextRequest.delete<ApiResponse<boolean>>(`/products/${id}`);
    
    return response.data;
}