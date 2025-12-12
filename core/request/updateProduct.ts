import { UpApiContextRequest, type ApiResponse } from "../apiContext/UpApiContextRequest";

export interface UpdateProductRequest{
    id: string;
    tenantId: string;
    productCategoryId: string;
    name: string;
    description: string;
    sku: string;
    price: number;
    perishable: boolean
}

export async function updateProduct(data: UpdateProductRequest): Promise<ApiResponse<boolean>> {
    const response = await UpApiContextRequest.put<ApiResponse<boolean>>('/products', data);

    return response.data;
}