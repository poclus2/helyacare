export interface ISmsProvider {
    name: string;
    sendSms(to: string, message: string, isOtp?: boolean): Promise<SmsResult>;
    supports(phoneNumber: string): boolean;
}
export interface SmsResult {
    success: boolean;
    messageId?: string;
    error?: string;
    provider: string;
    details?: any;
}
export interface SmsProviderConfig {
    enabled: boolean;
    priority: number;
}
