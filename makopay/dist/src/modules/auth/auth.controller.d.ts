import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<any>;
    login(loginDto: LoginDto): Promise<{
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
    getProfile(req: any): any;
    verifyPhone(body: {
        phoneNumber: string;
        code: string;
    }): Promise<any>;
    resendCode(body: {
        phoneNumber: string;
    }): Promise<any>;
    changePassword(req: any, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
