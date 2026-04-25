import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { InvestmentsService } from '../investments/investments.service';
import { MlmService } from '../mlm/mlm.service';
import { WalletService } from '../wallet/wallet.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class OrdersService {
    private prisma;
    private investmentsService;
    private mlmService;
    private walletService;
    private notificationsService;
    private readonly logger;
    constructor(prisma: PrismaService, investmentsService: InvestmentsService, mlmService: MlmService, walletService: WalletService, notificationsService: NotificationsService);
    create(userId: string, createOrderDto: CreateOrderDto): Promise<{
        items: {
            id: string;
            orderId: string;
            productId: string;
            quantity: number;
            unitPrice: Prisma.Decimal;
        }[];
    } & {
        id: string;
        userId: string;
        totalAmount: Prisma.Decimal;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findAll(userId?: string): Promise<({
        items: ({
            product: {
                id: string;
                name: string;
                description: string | null;
                sku: string;
                price: Prisma.Decimal;
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
            unitPrice: Prisma.Decimal;
        })[];
    } & {
        id: string;
        userId: string;
        totalAmount: Prisma.Decimal;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    findOne(id: string, userId?: string): Promise<({
        items: ({
            product: {
                id: string;
                name: string;
                description: string | null;
                sku: string;
                price: Prisma.Decimal;
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
            unitPrice: Prisma.Decimal;
        })[];
    } & {
        id: string;
        userId: string;
        totalAmount: Prisma.Decimal;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }) | null>;
    pay(id: string, userId: string): Promise<{
        items: ({
            product: {
                id: string;
                name: string;
                description: string | null;
                sku: string;
                price: Prisma.Decimal;
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
            unitPrice: Prisma.Decimal;
        })[];
    } & {
        id: string;
        userId: string;
        totalAmount: Prisma.Decimal;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    remove(id: string, userId: string, isAdmin: boolean): Promise<{
        id: string;
        userId: string;
        totalAmount: Prisma.Decimal;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
}
