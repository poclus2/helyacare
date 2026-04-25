import { PrismaService } from '../../core/database/prisma/prisma.service';
import { Prisma, WalletTransactionType, LedgerSource } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { SettingsService } from '../settings/settings.service';
export declare class WalletService {
    private prisma;
    private notificationsService;
    private settingsService;
    private readonly logger;
    constructor(prisma: PrismaService, notificationsService: NotificationsService, settingsService: SettingsService);
    getBalance(userId: string): Promise<Prisma.Decimal>;
    createWallet(userId: string): Promise<{
        id: string;
        userId: string;
        balance: Prisma.Decimal;
        currency: string;
        updatedAt: Date;
    }>;
    getWallet(userId: string): Promise<{
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
    credit(userId: string, amount: Prisma.Decimal, type: WalletTransactionType, source: LedgerSource, reference: string, tx?: Prisma.TransactionClient): Promise<Prisma.Decimal>;
    debit(userId: string, amount: Prisma.Decimal, type: WalletTransactionType, source: LedgerSource, reference: string, status?: string, tx?: Prisma.TransactionClient): Promise<Prisma.Decimal>;
    createDepositRequest(userId: string, amount: Prisma.Decimal, method: string, payerPhoneNumber?: string, currency?: string): Promise<{
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
    requestWithdrawal(userId: string, amount: Prisma.Decimal, method: string, details: string): Promise<{
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
    getPendingWithdrawals(): Promise<({
        wallet: {
            user: {
                id: string;
                phoneNumber: string;
                email: string | null;
                firstName: string | null;
                lastName: string | null;
            };
        } & {
            id: string;
            userId: string;
            balance: Prisma.Decimal;
            currency: string;
            updatedAt: Date;
        };
    } & {
        id: string;
        walletId: string;
        type: import("@prisma/client").$Enums.WalletTransactionType;
        source: import("@prisma/client").$Enums.LedgerSource;
        amount: Prisma.Decimal;
        reference: string | null;
        balanceAfter: Prisma.Decimal;
        status: string;
        createdAt: Date;
    })[]>;
    approveWithdrawal(ledgerId: string): Promise<{
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
    rejectWithdrawal(ledgerId: string): Promise<{
        success: boolean;
    }>;
}
