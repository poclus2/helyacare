"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const argon2 = __importStar(require("argon2"));
const users_service_1 = require("../users/users.service");
const notifications_service_1 = require("../notifications/notifications.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    notificationsService;
    constructor(usersService, jwtService, notificationsService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.notificationsService = notificationsService;
    }
    async register(registerDto) {
        const existingUser = await this.usersService.findOne(registerDto.phoneNumber);
        if (existingUser) {
            throw new common_1.ConflictException('Phone number already exists');
        }
        const hashedPassword = await argon2.hash(registerDto.password);
        const userData = {
            phoneNumber: registerDto.phoneNumber,
            passwordHash: hashedPassword,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            referralCode: this.generateReferralCode(),
        };
        if (registerDto.email) {
            userData.email = registerDto.email;
        }
        let sponsorId = null;
        if (registerDto.referralCode) {
            const sponsor = await this.usersService.findByReferralCode(registerDto.referralCode);
            if (!sponsor) {
                throw new common_1.BadRequestException('Invalid referral code');
            }
            userData.sponsor = { connect: { id: sponsor.id } };
            sponsorId = sponsor.id;
        }
        else if (registerDto.sponsorId) {
            userData.sponsor = { connect: { id: registerDto.sponsorId } };
            sponsorId = registerDto.sponsorId;
        }
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        userData.otpCode = otpCode;
        userData.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        userData.phoneVerified = false;
        const user = await this.usersService.create(userData);
        if (sponsorId) {
            await this.notificationsService.sendNewReferralNotification(sponsorId, `${user.firstName} ${user.lastName}`);
        }
        try {
            await this.notificationsService.sendSms(user.phoneNumber, `Votre code de vérification MakoPay est: ${otpCode}`, true);
        }
        catch (error) {
            console.error('Failed to send OTP SMS', error);
        }
        return {
            message: 'Registration successful. Please verify your phone number.',
            userId: user.id,
            phoneNumber: user.phoneNumber,
            requiresVerification: true
        };
    }
    generateReferralCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    async verifyPhone(phoneNumber, code) {
        const user = await this.usersService.findOne(phoneNumber);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (user.phoneVerified) {
            return this.login(user);
        }
        if (user.otpCode !== code) {
            throw new common_1.BadRequestException('Invalid verification code');
        }
        if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
            throw new common_1.BadRequestException('Verification code expired');
        }
        await this.usersService.update(user.id, {
            phoneVerified: true,
            otpCode: null,
            otpExpiresAt: null,
        });
        const updatedUser = await this.usersService.findById(user.id);
        return this.login(updatedUser);
    }
    async validateUser(phoneNumber, pass) {
        const user = await this.usersService.findOne(phoneNumber);
        if (user && (await argon2.verify(user.passwordHash, pass))) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { phoneNumber: user.phoneNumber, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                phoneNumber: user.phoneNumber,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                kycStatus: user.kycStatus,
            }
        };
    }
    async resendVerificationCode(phoneNumber) {
        const user = await this.usersService.findOne(phoneNumber);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (user.phoneVerified) {
            throw new common_1.ConflictException('Phone number already verified');
        }
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.usersService.update(user.id, {
            otpCode,
            otpExpiresAt,
        });
        try {
            await this.notificationsService.sendSms(user.phoneNumber, `Votre nouveau code de vérification MakoPay est: ${otpCode}`, true);
        }
        catch (error) {
            console.error('Failed to resend OTP SMS', error);
            throw new common_1.BadRequestException('Failed to send SMS');
        }
        return { message: 'Verification code resent successfully' };
    }
    async getProfile(userId) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        const { passwordHash, ...result } = user;
        return result;
    }
    async changePassword(userId, dto) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isMatch = await argon2.verify(user.passwordHash, dto.currentPassword);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        const newHashedPassword = await argon2.hash(dto.newPassword);
        await this.usersService.update(userId, { passwordHash: newHashedPassword });
        await this.notificationsService.createInAppNotification(userId, 'Security Alert', 'Your password has been changed successfully.', 'WARNING');
        return { message: 'Password changed successfully' };
    }
    async generateWithdrawalOtp(userId) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.usersService.update(user.id, {
            otpCode,
            otpExpiresAt,
        });
        let channel = 'sms';
        let target = user.phoneNumber;
        if (user.email) {
            channel = 'email';
            target = user.email;
        }
        try {
            await this.notificationsService.sendOtp(target, otpCode, channel);
        }
        catch (error) {
            console.error(`Failed to send withdrawal OTP via ${channel}`, error);
            throw new common_1.BadRequestException(`Failed to send verification code via ${channel}`);
        }
        return { channel, target };
    }
    async validateOtp(userId, code) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (!user.otpCode || user.otpCode !== code) {
            return false;
        }
        if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
            throw new common_1.BadRequestException('Verification code expired');
        }
        await this.usersService.update(user.id, {
            otpCode: null,
            otpExpiresAt: null,
        });
        return true;
    }
    async forgotPassword(phoneNumber) {
        const user = await this.usersService.findOne(phoneNumber);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.usersService.update(user.id, {
            otpCode,
            otpExpiresAt,
        });
        try {
            await this.notificationsService.sendSms(user.phoneNumber, `Votre code de réinitialisation MakoPay est: ${otpCode}. Valide pendant 10 minutes.`, true);
        }
        catch (error) {
            console.error('Failed to send reset password OTP SMS', error);
            throw new common_1.BadRequestException('Failed to send SMS');
        }
        return { message: 'Verification code sent successfully' };
    }
    async resetPassword(phoneNumber, otpCode, newPassword) {
        const user = await this.usersService.findOne(phoneNumber);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (!user.otpCode || user.otpCode !== otpCode) {
            throw new common_1.BadRequestException('Invalid verification code');
        }
        if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
            throw new common_1.BadRequestException('Verification code expired');
        }
        const hashedPassword = await argon2.hash(newPassword);
        await this.usersService.update(user.id, {
            passwordHash: hashedPassword,
            otpCode: null,
            otpExpiresAt: null,
        });
        await this.notificationsService.createInAppNotification(user.id, 'Security Alert', 'Your password has been reset successfully.', 'WARNING');
        return { message: 'Password reset successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        notifications_service_1.NotificationsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map