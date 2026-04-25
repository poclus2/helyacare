import { Queue } from 'bullmq';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Campaign, CampaignType, User, Template } from '@prisma/client';
import { CreateCampaignDto, FilterUsersDto } from './dto/create-campaign.dto';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/template.dto';
export interface CampaignStats {
    totalRecipients: number;
    sentCount: number;
    deliveredCount: number;
    failedCount: number;
    openedCount: number;
    clickedCount: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
}
export declare class MarketingService {
    private readonly prisma;
    private readonly notificationsService;
    private campaignQueue;
    private readonly logger;
    constructor(prisma: PrismaService, notificationsService: NotificationsService, campaignQueue: Queue);
    createCampaign(dto: CreateCampaignDto, userId: string): Promise<Campaign>;
    getCampaigns(filters?: {
        type?: CampaignType;
        status?: string;
    }, pagination?: {
        skip?: number;
        take?: number;
    }): Promise<Campaign[]>;
    getCampaign(id: string): Promise<Campaign>;
    deleteCampaign(id: string): Promise<void>;
    sendCampaign(id: string): Promise<void>;
    sendTestCampaign(id: string, recipient: string): Promise<void>;
    getCampaignStats(id: string): Promise<CampaignStats>;
    previewTargetedUsers(filters: FilterUsersDto): Promise<Partial<User>[]>;
    countTargetedUsers(filters: FilterUsersDto): Promise<number>;
    private buildUserFilter;
    createTemplate(dto: CreateTemplateDto, userId: string): Promise<Template>;
    getTemplates(type?: CampaignType): Promise<Template[]>;
    updateTemplate(id: string, dto: UpdateTemplateDto): Promise<Template>;
    deleteTemplate(id: string): Promise<void>;
    createRecipients(campaign: Campaign): Promise<number>;
    estimateCost(type: CampaignType, recipientCount: number, messageLength: number): Promise<number>;
}
