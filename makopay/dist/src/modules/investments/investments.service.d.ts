import { PrismaService } from '../../core/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { WalletService } from '../wallet/wallet.service';
import { CreateInvestmentPlanDto } from './dto/create-investment-plan.dto';
import { UpdateInvestmentPlanDto } from './dto/update-investment-plan.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class InvestmentsService {
    private prisma;
    private walletService;
    private notificationsService;
    private readonly logger;
    constructor(prisma: PrismaService, walletService: WalletService, notificationsService: NotificationsService);
    createPlan(data: CreateInvestmentPlanDto): Promise<{
        id: string;
        name: string;
        durationDays: number;
        yieldPercent: Prisma.Decimal;
        payoutFrequency: import("@prisma/client").$Enums.PayoutFrequency;
        minAmount: Prisma.Decimal;
        maxAmount: Prisma.Decimal | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    updatePlan(id: string, data: UpdateInvestmentPlanDto): Promise<{
        id: string;
        name: string;
        durationDays: number;
        yieldPercent: Prisma.Decimal;
        payoutFrequency: import("@prisma/client").$Enums.PayoutFrequency;
        minAmount: Prisma.Decimal;
        maxAmount: Prisma.Decimal | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    deletePlan(id: string): Promise<{
        id: string;
        name: string;
        durationDays: number;
        yieldPercent: Prisma.Decimal;
        payoutFrequency: import("@prisma/client").$Enums.PayoutFrequency;
        minAmount: Prisma.Decimal;
        maxAmount: Prisma.Decimal | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findAllPlans(): Promise<{
        id: string;
        name: string;
        durationDays: number;
        yieldPercent: Prisma.Decimal;
        payoutFrequency: import("@prisma/client").$Enums.PayoutFrequency;
        minAmount: Prisma.Decimal;
        maxAmount: Prisma.Decimal | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }[]>;
    findPlanById(id: string): Promise<{
        id: string;
        name: string;
        durationDays: number;
        yieldPercent: Prisma.Decimal;
        payoutFrequency: import("@prisma/client").$Enums.PayoutFrequency;
        minAmount: Prisma.Decimal;
        maxAmount: Prisma.Decimal | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findAllInvestments(userId: string): Promise<({
        plan: {
            id: string;
            name: string;
            durationDays: number;
            yieldPercent: Prisma.Decimal;
            payoutFrequency: import("@prisma/client").$Enums.PayoutFrequency;
            minAmount: Prisma.Decimal;
            maxAmount: Prisma.Decimal | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        payouts: {
            id: string;
            investmentId: string;
            amount: Prisma.Decimal;
            payoutDate: Date;
        }[];
    } & {
        id: string;
        userId: string;
        orderId: string;
        planId: string;
        principalAmount: Prisma.Decimal;
        startDate: Date;
        endDate: Date | null;
        status: import("@prisma/client").$Enums.InvestmentStatus;
        lastPayoutAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    findAllInvestmentsAdmin(search?: string, status?: string): Promise<({
        user: {
            id: string;
            referralCode: string | null;
            email: string | null;
            firstName: string | null;
            lastName: string | null;
        };
        plan: {
            id: string;
            name: string;
            durationDays: number;
            yieldPercent: Prisma.Decimal;
            payoutFrequency: import("@prisma/client").$Enums.PayoutFrequency;
            minAmount: Prisma.Decimal;
            maxAmount: Prisma.Decimal | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        payouts: {
            id: string;
            investmentId: string;
            amount: Prisma.Decimal;
            payoutDate: Date;
        }[];
    } & {
        id: string;
        userId: string;
        orderId: string;
        planId: string;
        principalAmount: Prisma.Decimal;
        startDate: Date;
        endDate: Date | null;
        status: import("@prisma/client").$Enums.InvestmentStatus;
        lastPayoutAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    getInvestmentStats(): Promise<{
        activeCount: number;
        completedCount: number;
        totalVolume: number | Prisma.Decimal;
    }>;
    createInvestmentFromOrder(orderId: string, userId: string, items: any[], tx?: Prisma.TransactionClient): Promise<void>;
    handleHourlyPayouts(): Promise<void>;
    handleDailyPayouts(): Promise<void>;
    private processPayout;
}
