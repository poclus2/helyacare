import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        id: string;
        email: string | null;
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
    } | null>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<{
        id: string;
        email: string | null;
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
    }>;
    submitKyc(req: any, body: any): Promise<{
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
    }>;
    deleteUserFull(id: string): Promise<{
        message: string;
    }>;
}
