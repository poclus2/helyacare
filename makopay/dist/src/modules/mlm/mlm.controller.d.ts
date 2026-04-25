import { MlmService } from './mlm.service';
export declare class MlmController {
    private readonly mlmService;
    constructor(mlmService: MlmService);
    getNetwork(req: any): Promise<{
        commissionsReceived: {
            amount: import("@prisma/client/runtime/library").Decimal;
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
            kycStatus: import(".prisma/client").$Enums.KycStatus;
            createdAt: Date;
            referrals: {
                id: string;
                email: string | null;
                firstName: string | null;
                lastName: string | null;
                kycStatus: import(".prisma/client").$Enums.KycStatus;
                createdAt: Date;
                referrals: {
                    id: string;
                    email: string | null;
                    firstName: string | null;
                    lastName: string | null;
                    kycStatus: import(".prisma/client").$Enums.KycStatus;
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
        role?: import(".prisma/client").$Enums.UserRole | undefined;
        kycStatus?: import(".prisma/client").$Enums.KycStatus | undefined;
        sponsorId?: string | null | undefined;
        phoneNumber?: string | undefined;
        referralCode?: string | null | undefined;
        phoneVerified?: boolean | undefined;
        otpCode?: string | null | undefined;
        otpExpiresAt?: Date | null | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
        deletedAt?: Date | null | undefined;
        kycData?: import(".prisma/client").Prisma.JsonValue | undefined;
        kycSubmittedAt?: Date | null | undefined;
    }>;
}
