import { WalletService } from './wallet.service';
import { Prisma } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
export declare class WalletController {
    private readonly walletService;
    private readonly authService;
    constructor(walletService: WalletService, authService: AuthService);
    getWallet(req: any): Promise<{
        pendingDeposits: {
            id: string;
            userId: string;
            amount: Prisma.Decimal;
            method: string;
            payerPhoneNumber: string | null;
            currency: string;
            status: string;
            referenceCode: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        ledger?: {
            id: string;
            walletId: string;
            type: import("@prisma/client").$Enums.WalletTransactionType;
            source: import("@prisma/client").$Enums.LedgerSource;
            amount: Prisma.Decimal;
            reference: string | null;
            balanceAfter: Prisma.Decimal;
            status: string;
            createdAt: Date;
        }[] | undefined;
        id?: string | undefined;
        userId?: string | undefined;
        balance?: Prisma.Decimal | undefined;
        currency?: string | undefined;
        updatedAt?: Date | undefined;
    }>;
    withdrawOtp(req: any): Promise<{
        channel: "email" | "sms";
        target: string;
    }>;
    withdraw(req: any, body: {
        amount: number;
        method?: string;
        details?: string;
        otp?: string;
    }): Promise<{
        id: string;
        walletId: string;
        type: import("@prisma/client").$Enums.WalletTransactionType;
        source: import("@prisma/client").$Enums.LedgerSource;
        amount: Prisma.Decimal;
        reference: string | null;
        balanceAfter: Prisma.Decimal;
        status: string;
        createdAt: Date;
    }>;
    deposit(req: any, body: {
        amount: number;
        method: string;
        payerPhoneNumber?: string;
        currency?: string;
    }): Promise<{
        id: string;
        userId: string;
        amount: Prisma.Decimal;
        method: string;
        payerPhoneNumber: string | null;
        currency: string;
        status: string;
        referenceCode: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
