import { CampaignType } from '@prisma/client';
export declare class CreateTemplateDto {
    name: string;
    description?: string;
    type: CampaignType;
    subject?: string;
    content: string;
    contentHtml?: string;
    variables?: string[];
}
export declare class UpdateTemplateDto {
    name?: string;
    description?: string;
    subject?: string;
    content?: string;
    contentHtml?: string;
    variables?: string[];
    isActive?: boolean;
}
