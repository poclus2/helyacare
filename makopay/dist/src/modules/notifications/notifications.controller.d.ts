import { NotificationsService } from './notifications.service';
declare class TestEmailDto {
    to: string;
    name: string;
}
declare class TestSmsDto {
    phoneNumber: string;
    name: string;
}
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    sendTestEmail(dto: TestEmailDto): Promise<any>;
    sendTestSms(dto: TestSmsDto): Promise<import("./interfaces/sms-provider.interface").SmsResult | null>;
    sendTestWhatsApp(dto: TestSmsDto): Promise<any>;
    getUserNotifications(req: any): Promise<{
        notifications: {
            id: string;
            userId: string;
            title: string;
            message: string;
            type: string;
            read: boolean;
            createdAt: Date;
        }[];
        unreadCount: number;
    }>;
    markAsRead(id: string, req: any): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        type: string;
        read: boolean;
        createdAt: Date;
    }>;
    markAllAsRead(req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
export {};
