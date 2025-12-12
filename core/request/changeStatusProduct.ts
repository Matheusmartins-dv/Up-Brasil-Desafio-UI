import { UpApiContextRequest, type ApiResponse } from "../apiContext/UpApiContextRequest";

export async function changeStatusProduct(id: string): Promise<ApiResponse<boolean>> {
    const response = await UpApiContextRequest.patch<ApiResponse<boolean>>(`/products/${id}`);
    
    return response.data;
}