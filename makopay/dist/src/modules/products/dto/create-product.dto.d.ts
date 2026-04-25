export declare class CreateProductDto {
    name: string;
    sku: string;
    description?: string;
    imageUrl?: string;
    price: number;
    stock: number;
    isCommissionable?: boolean;
    investmentPlanId?: string;
}
