import { UpApiContextRequest, type ApiResponse } from "../apiContext/UpApiContextRequest";

export interface CreateProductRequest{
    tenantId: string;
    productCategoryId: string;
    name: string;
    description: string;
    sku: string;
    price: number;
    perishable: boolean
}

export async function createProduct(data: CreateProductRequest): Promise<ApiResponse<boolean>> {
    const response = await UpApiContextRequest.post<ApiResponse<boolean>>('/products', data);
    
    return response.data;
}