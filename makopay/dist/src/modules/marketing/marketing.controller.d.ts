import { CampaignType } from '@prisma/client';
import { MarketingService } from './marketing.service';
import { CreateCampaignDto, FilterUsersDto } from './dto/create-campaign.dto';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/template.dto';
export declare class MarketingController {
    private readonly marketingService;
    constructor(marketingService: MarketingService);
    createCampaign(dto: CreateCampaignDto, req: any): Promise<Campaign>;
    getCampaigns(type?: CampaignType, status?: string, skip?: string, take?: string): Promise<Campaign[]>;
    getCampaign(id: string): Promise<Campaign>;
    deleteCampaign(id: string): Promise<{
        message: string;
    }>;
    sendCampaign(id: string): Promise<{
        message: string;
    }>;
    sendTestCampaign(id: string, body: {
        recipient: string;
    }): Promise<{
        message: string;
    }>;
    getCampaignStats(id: string): Promise<import("./marketing.service").CampaignStats>;
    previewTargetedUsers(filters: FilterUsersDto): Promise<Partial<{
        id: string;
        email: string | null;
        passwordHash: string;
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
    }>[]>;
    countTargetedUsers(filters: FilterUsersDto): Promise<{
        count: number;
    }>;
    createTemplate(dto: CreateTemplateDto, req: any): Promise<Template>;
    getTemplates(type?: CampaignType): Promise<Template[]>;
    updateTemplate(id: string, dto: UpdateTemplateDto): Promise<Template>;
    deleteTemplate(id: string): Promise<{
        message: string;
    }>;
}
