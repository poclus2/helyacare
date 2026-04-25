import { CampaignType, TargetType } from '@prisma/client';
export declare class FilterUsersDto {
    kycStatus?: string;
    registeredAfter?: Date;
    registeredBefore?: Date;
    balanceMin?: number;
    balanceMax?: number;
    hasInvestments?: boolean;
    hasReferrals?: boolean;
    phonePrefix?: string;
}
export declare class CreateCampaignDto {
    name: string;
    type: CampaignType;
    subject?: string;
    message: string;
    templateId?: string;
    targetType: TargetType;
    filters?: FilterUsersDto;
    customListUrl?: string;
    sendNow?: boolean;
    scheduledAt?: Date;
}
