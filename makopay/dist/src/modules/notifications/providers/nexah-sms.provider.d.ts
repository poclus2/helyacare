import { ConfigService } from '@nestjs/config';
import { ISmsProvider, SmsResult } from '../interfaces/sms-provider.interface';
export declare class NexahSmsProvider implements ISmsProvider {
    private configService;
    private readonly logger;
    readonly name = "NEXAH";
    private readonly baseUrl;
    private readonly username;
    private readonly password;
    constructor(configService: ConfigService);
    supports(phoneNumber: string): boolean;
    sendSms(to: string, message: string, isOtp?: boolean): Promise<SmsResult>;
    getBalance(): Promise<{
        credit: number;
        accountExpDate: string;
        balanceExpDate: string;
    } | null>;
}
