import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getStats(): Promise<{
        totalUsers: number;
        pendingDeposits: number;
        totalVolume: number | import("@prisma/client/runtime/library").Decimal;
    }>;
    getPendingDeposits(): Promise<({
        user: {
            phoneNumber: string;
            email: string | null;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        userId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        method: string;
        payerPhoneNumber: string | null;
        currency: string;
        status: string;
        referenceCode: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getUsers(): Promise<({
        wallet: {
            balance: import("@prisma/client/runtime/library").Decimal;
        } | null;
    } & {
        id: string;
        email: string | null;
        passwordHash: string;
        firstName: string | null;
        lastName: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        sponsorId: string | null;
        phoneNumber: string;
        referralCode: string | null;
        phoneVerified: boolean;
        otpCode: string | null;
        otpExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        kycData: import("@prisma/client").Prisma.JsonValue | null;
        kycSubmittedAt: Date | null;
    })[]>;
    approveDeposit(id: string): Promise<{
        success: boolean;
    }>;
    rejectDeposit(id: string): Promise<{
        success: boolean;
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
            balance: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            updatedAt: Date;
        };
    } & {
        id: string;
        walletId: string;
        type: import("@prisma/client").$Enums.WalletTransactionType;
        source: import("@prisma/client").$Enums.LedgerSource;
        amount: import("@prisma/client/runtime/library").Decimal;
        reference: string | null;
        balanceAfter: import("@prisma/client/runtime/library").Decimal;
        status: string;
        createdAt: Date;
    })[]>;
    approveWithdrawal(id: string): Promise<{
        id: string;
        walletId: string;
        type: import("@prisma/client").$Enums.WalletTransactionType;
        source: import("@prisma/client").$Enums.LedgerSource;
        amount: import("@prisma/client/runtime/library").Decimal;
        reference: string | null;
        balanceAfter: import("@prisma/client/runtime/library").Decimal;
        status: string;
        createdAt: Date;
    }>;
    rejectWithdrawal(id: string): Promise<{
        success: boolean;
    }>;
}
