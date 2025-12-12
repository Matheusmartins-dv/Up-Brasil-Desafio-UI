import { UpApiContextRequest, type ApiResponse } from "../apiContext/UpApiContextRequest";

export interface CreateTenantUserRequest{
    firstName: string;
    lastName: string;
    document: string;
    email: string;
    password: string;
    tenantId: string;
}

export async function createTenantUser(data: CreateTenantUserRequest): Promise<ApiResponse<boolean>> {
    const response = await UpApiContextRequest.post<ApiResponse<boolean>>('/tenants/users', data);
    
    return response.data;
}