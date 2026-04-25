import { InfobipProvider } from './infobip.provider';
import { ISmsProvider, SmsResult } from '../interfaces/sms-provider.interface';
export declare class InfobipSmsProvider implements ISmsProvider {
    private readonly infobipProvider;
    private readonly logger;
    readonly name = "Infobip";
    constructor(infobipProvider: InfobipProvider);
    supports(phoneNumber: string): boolean;
    sendSms(to: string, message: string, isOtp?: boolean): Promise<SmsResult>;
}
