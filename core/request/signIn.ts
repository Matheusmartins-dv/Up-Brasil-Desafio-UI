// src/core/requests/Auth/SignIn.ts

import { UpApiContextRequest, type ApiResponse } from "../apiContext/UpApiContextRequest";

export interface SignInRequest {
    email: string;
    password: string;
}
export interface SignInResponse {
    id: string;
    tenantIds: string[];
}

export async function signIn(data: SignInRequest): Promise<ApiResponse<SignInResponse>> {
    const response = await UpApiContextRequest.post<ApiResponse<SignInResponse>>('/users/signin', data);
    
    return response.data;
}