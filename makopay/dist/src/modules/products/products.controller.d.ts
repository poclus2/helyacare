import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        sku: string;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        imageUrl: string | null;
        isCommissionable: boolean;
        investmentPlanId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findAll(minPrice?: number, maxPrice?: number, planId?: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        sku: string;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        imageUrl: string | null;
        isCommissionable: boolean;
        investmentPlanId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        sku: string;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        imageUrl: string | null;
        isCommissionable: boolean;
        investmentPlanId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        sku: string;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        imageUrl: string | null;
        isCommissionable: boolean;
        investmentPlanId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        sku: string;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        imageUrl: string | null;
        isCommissionable: boolean;
        investmentPlanId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    uploadImage(file: any): Promise<{
        url: string;
    }>;
}
