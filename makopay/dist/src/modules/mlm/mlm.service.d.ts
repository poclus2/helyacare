import { PrismaService } from '../../core/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { WalletService } from '../wallet/wallet.service';
import { Queue } from 'bullmq';
export declare class MlmService {
    private prisma;
    private walletService;
    private mlmQueue;
    private readonly logger;
    private readonly COMMISSION_RATES;
    constructor(prisma: PrismaService, walletService: WalletService, mlmQueue: Queue);
    getNetwork(userId: string): Promise<{
        commissionsReceived: {
            amount: Prisma.Decimal;
            createdAt: Date;
        }[];
        sponsor?: {
            id: string;
            email: string | null;
            firstName: string | null;
            lastName: string | null;
        } | null | undefined;
        referrals?: {
            id: string;
            email: string | null;
            firstName: string | null;
            lastName: string | null;
            kycStatus: import("@prisma/client").$Enums.KycStatus;
            createdAt: Date;
            referrals: {
                id: string;
                email: string | null;
                firstName: string | null;
                lastName: string | null;
                kycStatus: import("@prisma/client").$Enums.KycStatus;
                createdAt: Date;
                referrals: {
                    id: string;
                    email: string | null;
                    firstName: string | null;
                    lastName: string | null;
                    kycStatus: import("@prisma/client").$Enums.KycStatus;
                    createdAt: Date;
                }[];
            }[];
        }[] | undefined;
        wallet?: {
            id: string;
        } | null | undefined;
        id?: string | undefined;
        email?: string | null | undefined;
        passwordHash?: string | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        role?: import("@prisma/client").$Enums.UserRole | undefined;
        kycStatus?: import("@prisma/client").$Enums.KycStatus | undefined;
        sponsorId?: string | null | undefined;
        phoneNumber?: string | undefined;
        referralCode?: string | null | undefined;
        phoneVerified?: boolean | undefined;
        otpCode?: string | null | undefined;
        otpExpiresAt?: Date | null | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
        deletedAt?: Date | null | undefined;
        kycData?: Prisma.JsonValue | undefined;
        kycSubmittedAt?: Date | null | undefined;
    }>;
    handleCommissionDistributionJob(orderId: string, userId: string, amountInput: string | number | Prisma.Decimal): Promise<void>;
    distributeCommissions(orderId: string, userId: string, amount: Prisma.Decimal): Promise<void>;
}
