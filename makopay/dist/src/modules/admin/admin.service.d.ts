import { PrismaService } from '../../core/database/prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { UsersService } from '../users/users.service';
import { SettingsService } from '../settings/settings.service';
export declare class AdminService {
    private prisma;
    private walletService;
    private usersService;
    private settingsService;
    constructor(prisma: PrismaService, walletService: WalletService, usersService: UsersService, settingsService: SettingsService);
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
        type: import(".prisma/client").$Enums.WalletTransactionType;
        source: import(".prisma/client").$Enums.LedgerSource;
        amount: import("@prisma/client/runtime/library").Decimal;
        reference: string | null;
        balanceAfter: import("@prisma/client/runtime/library").Decimal;
        status: string;
        createdAt: Date;
    })[]>;
    approveWithdrawal(ledgerId: string): Promise<{
        id: string;
        walletId: string;
        type: import(".prisma/client").$Enums.WalletTransactionType;
        source: import(".prisma/client").$Enums.LedgerSource;
        amount: import("@prisma/client/runtime/library").Decimal;
        reference: string | null;
        balanceAfter: import("@prisma/client/runtime/library").Decimal;
        status: string;
        createdAt: Date;
    }>;
    rejectWithdrawal(ledgerId: string): Promise<{
        success: boolean;
    }>;
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
        role: import(".prisma/client").$Enums.UserRole;
        kycStatus: import(".prisma/client").$Enums.KycStatus;
        sponsorId: string | null;
        phoneNumber: string;
        referralCode: string | null;
        phoneVerified: boolean;
        otpCode: string | null;
        otpExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        kycData: import(".prisma/client").Prisma.JsonValue | null;
        kycSubmittedAt: Date | null;
    })[]>;
    getPendingKycUsers(): Promise<({
        wallet: {
            id: string;
            userId: string;
            balance: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            updatedAt: Date;
        } | null;
    } & {
        id: string;
        email: string | null;
        passwordHash: string;
        firstName: string | null;
        lastName: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        kycStatus: import(".prisma/client").$Enums.KycStatus;
        sponsorId: string | null;
        phoneNumber: string;
        referralCode: string | null;
        phoneVerified: boolean;
        otpCode: string | null;
        otpExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        kycData: import(".prisma/client").Prisma.JsonValue | null;
        kycSubmittedAt: Date | null;
    })[]>;
    updateKycStatus(userId: string, action: 'approve' | 'reject'): Promise<{
        id: string;
        email: string | null;
        passwordHash: string;
        firstName: string | null;
        lastName: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        kycStatus: import(".prisma/client").$Enums.KycStatus;
        sponsorId: string | null;
        phoneNumber: string;
        referralCode: string | null;
        phoneVerified: boolean;
        otpCode: string | null;
        otpExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        kycData: import(".prisma/client").Prisma.JsonValue | null;
        kycSubmittedAt: Date | null;
    }>;
    approveDeposit(depositId: string): Promise<{
        success: boolean;
    }>;
    rejectDeposit(depositId: string): Promise<{
        success: boolean;
    }>;
}
