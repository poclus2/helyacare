import { InvestmentsService } from './investments.service';
import { CreateInvestmentPlanDto } from './dto/create-investment-plan.dto';
import { UpdateInvestmentPlanDto } from './dto/update-investment-plan.dto';
export declare class InvestmentsController {
    private readonly investmentsService;
    constructor(investmentsService: InvestmentsService);
    createPlan(body: CreateInvestmentPlanDto): Promise<{
        id: string;
        name: string;
        durationDays: number;
        yieldPercent: import("@prisma/client/runtime/library").Decimal;
        payoutFrequency: import("@prisma/client").$Enums.PayoutFrequency;
        minAmount: import("@prisma/client/runtime/library").Decimal;
        maxAmount: import("@prisma/client/runtime/library").Decimal | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    updatePlan(id: string, body: UpdateInvestmentPlanDto): Promise<{
        id: string;
        name: string;
        durationDays: number;
        yieldPercent: import("@prisma/client/runtime/library").Decimal;
        payoutFrequency: import("@prisma/client").$Enums.PayoutFrequency;
        minAmount: import("@prisma/client/runtime/library").Decimal;
        maxAmount: import("@prisma/client/runtime/library").Decimal | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    deletePlan(id: string): Promise<{
        id: string;
        name: string;
        durationDays: number;
        yieldPercent: import("@prisma/client/runtime/library").Decimal;
        payoutFrequency: import("@prisma/client").$Enums.PayoutFrequency;
        minAmount: import("@prisma/client/runtime/library").Decimal;
        maxAmount: import("@prisma/client/runtime/library").Decimal | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findAllPlans(): Promise<{
        id: string;
        name: string;
        durationDays: number;
        yieldPercent: import("@prisma/client/runtime/library").Decimal;
        payoutFrequency: import("@prisma/client").$Enums.PayoutFrequency;
        minAmount: import("@prisma/client/runtime/library").Decimal;
        maxAmount: import("@prisma/client/runtime/library").Decimal | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }[]>;
    myInvestments(req: any): Promise<({
        plan: {
            id: string;
            name: string;
            durationDays: number;
            yieldPercent: import("@prisma/client/runtime/library").Decimal;
            payoutFrequency: import("@prisma/client").$Enums.PayoutFrequency;
            minAmount: import("@prisma/client/runtime/library").Decimal;
            maxAmount: import("@prisma/client/runtime/library").Decimal | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        payouts: {
            id: string;
            investmentId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            payoutDate: Date;
        }[];
    } & {
        id: string;
        userId: string;
        orderId: string;
        planId: string;
        principalAmount: import("@prisma/client/runtime/library").Decimal;
        startDate: Date;
        endDate: Date | null;
        status: import("@prisma/client").$Enums.InvestmentStatus;
        lastPayoutAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    getAllInvestments(req: any): Promise<({
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
            yieldPercent: import("@prisma/client/runtime/library").Decimal;
            payoutFrequency: import("@prisma/client").$Enums.PayoutFrequency;
            minAmount: import("@prisma/client/runtime/library").Decimal;
            maxAmount: import("@prisma/client/runtime/library").Decimal | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        payouts: {
            id: string;
            investmentId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            payoutDate: Date;
        }[];
    } & {
        id: string;
        userId: string;
        orderId: string;
        planId: string;
        principalAmount: import("@prisma/client/runtime/library").Decimal;
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
        totalVolume: number | import("@prisma/client/runtime/library").Decimal;
    }>;
}
