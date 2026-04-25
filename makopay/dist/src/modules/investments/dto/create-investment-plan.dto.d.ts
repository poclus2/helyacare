import { PayoutFrequency } from '@prisma/client';
export declare class CreateInvestmentPlanDto {
    name: string;
    durationDays: number;
    yieldPercent: number;
    payoutFrequency: PayoutFrequency;
    minAmount: number;
    maxAmount?: number;
}
