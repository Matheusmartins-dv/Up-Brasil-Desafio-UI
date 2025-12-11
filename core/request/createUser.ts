import { UpApiContextRequest, type ApiResponse } from "../apiContext/UpApiContextRequest";

export interface CreateUserRequest{
    firstName: string;
    lastName: string;
    document: string;
    email: string;
    password: string;
}

export async function createUser(data: CreateUserRequest): Promise<ApiResponse<boolean>> {
    const response = await UpApiContextRequest.post<ApiResponse<boolean>>('/users', data);
    
    return response.data;
}