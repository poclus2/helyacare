import { EmailProvider } from './providers/email.provider';
import { InfobipProvider } from './providers/infobip.provider';
import { NexahSmsProvider } from './providers/nexah-sms.provider';
import { InfobipSmsProvider } from './providers/infobip-sms.provider';
import { NotificationSettingsService } from './notification-settings.service';
import { PrismaService } from '../../core/database/prisma/prisma.service';
export declare class NotificationsService {
    private readonly emailProvider;
    private readonly infobipProvider;
    private readonly nexahSmsProvider;
    private readonly infobipSmsProvider;
    private readonly settingsService;
    private readonly prisma;
    private readonly logger;
    private readonly smsProviders;
    constructor(emailProvider: EmailProvider, infobipProvider: InfobipProvider, nexahSmsProvider: NexahSmsProvider, infobipSmsProvider: InfobipSmsProvider, settingsService: NotificationSettingsService, prisma: PrismaService);
    sendEmail(to: string, subject: string, html: string, force?: boolean): Promise<any>;
    sendSms(to: string, message: string, force?: boolean): Promise<import("./interfaces/sms-provider.interface").SmsResult | null>;
    sendWhatsApp(to: string, message: string, force?: boolean): Promise<any>;
    sendOtp(to: string, code: string, channel?: 'sms' | 'whatsapp' | 'email'): Promise<any>;
    createInAppNotification(userId: string, title: string, message: string, type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'TRANSACTION'): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        type: string;
        read: boolean;
        createdAt: Date;
    }>;
    getUserNotifications(userId: string): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        type: string;
        read: boolean;
        createdAt: Date;
    }[]>;
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(notificationId: string, userId: string): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        type: string;
        read: boolean;
        createdAt: Date;
    }>;
    sendDepositSuccessNotification(userId: string, amount: string, currency: string, method: string): Promise<void>;
    sendWithdrawalRequestNotification(userId: string, amount: string, currency: string): Promise<void>;
    sendInvestmentStartedNotification(userId: string, planName: string, amount: string, currency: string, endDate: Date): Promise<void>;
    sendPayoutNotification(userId: string, amount: string, currency: string, source: string): Promise<void>;
    sendOrderPaidNotification(userId: string, orderId: string, amount: string, currency: string, itemCount: number): Promise<void>;
    sendNewReferralNotification(sponsorId: string, newUserName: string): Promise<void>;
    sendSupportReplyNotification(userId: string, ticketSubject: string, messagePreview: string, ticketId: string): Promise<void>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
