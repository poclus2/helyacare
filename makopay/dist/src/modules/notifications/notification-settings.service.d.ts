import { PrismaService } from '../../core/database/prisma/prisma.service';
export declare class NotificationSettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{
        emailEnabled: boolean;
        smsEnabled: boolean;
    }>;
    updateSettings(settings: {
        emailEnabled?: boolean;
        smsEnabled?: boolean;
    }): Promise<{
        emailEnabled: boolean;
        smsEnabled: boolean;
    }>;
}
