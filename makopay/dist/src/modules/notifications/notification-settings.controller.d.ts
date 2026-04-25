import { NotificationSettingsService } from './notification-settings.service';
import { NotificationsService } from './notifications.service';
declare class UpdateSettingsDto {
    emailEnabled?: boolean;
    smsEnabled?: boolean;
}
declare class TestEmailDto {
    to: string;
    name: string;
}
declare class TestSmsDto {
    phoneNumber: string;
    name: string;
}
export declare class NotificationSettingsController {
    private readonly settingsService;
    private readonly notificationsService;
    constructor(settingsService: NotificationSettingsService, notificationsService: NotificationsService);
    getSettings(): Promise<{
        emailEnabled: boolean;
        smsEnabled: boolean;
    }>;
    updateSettings(dto: UpdateSettingsDto): Promise<{
        emailEnabled: boolean;
        smsEnabled: boolean;
    }>;
    sendTestEmail(dto: TestEmailDto): Promise<any>;
    sendTestSms(dto: TestSmsDto): Promise<import("./interfaces/sms-provider.interface").SmsResult | null>;
}
export {};
