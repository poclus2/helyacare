import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(req: any, createOrderDto: CreateOrderDto): Promise<{
        items: {
            id: string;
            orderId: string;
            productId: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        id: string;
        userId: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findAll(req: any): Promise<({
        items: ({
            product: {
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
            };
        } & {
            id: string;
            orderId: string;
            productId: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        userId: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    findOne(req: any, id: string): Promise<{
        items: ({
            product: {
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
            };
        } & {
            id: string;
            orderId: string;
            productId: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        userId: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    pay(req: any, id: string): Promise<{
        items: ({
            product: {
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
            };
        } & {
            id: string;
            orderId: string;
            productId: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        userId: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
}
