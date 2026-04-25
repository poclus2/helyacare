import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private notificationsService;
    constructor(usersService: UsersService, jwtService: JwtService, notificationsService: NotificationsService);
    register(registerDto: RegisterDto): Promise<any>;
    private generateReferralCode;
    verifyPhone(phoneNumber: string, code: string): Promise<any>;
    validateUser(phoneNumber: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            phoneNumber: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
            kycStatus: any;
        };
    }>;
    resendVerificationCode(phoneNumber: string): Promise<any>;
    getProfile(userId: string): Promise<{
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
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    generateWithdrawalOtp(userId: string): Promise<{
        channel: 'email' | 'sms';
        target: string;
    }>;
    validateOtp(userId: string, code: string): Promise<boolean>;
    forgotPassword(phoneNumber: string): Promise<{
        message: string;
    }>;
    resetPassword(phoneNumber: string, otpCode: string, newPassword: string): Promise<{
        message: string;
    }>;
}
