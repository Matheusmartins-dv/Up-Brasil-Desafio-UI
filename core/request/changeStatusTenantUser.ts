import { UpApiContextRequest, type ApiResponse } from "../apiContext/UpApiContextRequest";

export async function changeStatusTenantUser(id: string): Promise<ApiResponse<boolean>> {
    const response = await UpApiContextRequest.patch<ApiResponse<boolean>>(`/tenants/users/${id}/status`);
    
    return response.data;
}