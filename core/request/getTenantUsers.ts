import { UpApiContextRequest, type ApiResponse } from "../apiContext/UpApiContextRequest";

export interface UserResponse {
    id: string;
    createdAt: string;
    active: boolean;
    userEmail: string;
    userName: string;
    userDocument: string;
    tenantDescription: string;
}

export async function getTenantUsers(tenantId: string): Promise<ApiResponse<UserResponse[]>> {
    const response = await UpApiContextRequest.get<ApiResponse<UserResponse[]>>(`/tenants/${tenantId}/users`);
    
    return response.data;
}