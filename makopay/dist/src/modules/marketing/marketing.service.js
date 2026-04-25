"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MarketingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketingService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const prisma_service_1 = require("../../core/database/prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const client_1 = require("@prisma/client");
const template_renderer_util_1 = require("./utils/template-renderer.util");
let MarketingService = MarketingService_1 = class MarketingService {
    prisma;
    notificationsService;
    campaignQueue;
    logger = new common_1.Logger(MarketingService_1.name);
    constructor(prisma, notificationsService, campaignQueue) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.campaignQueue = campaignQueue;
    }
    async createCampaign(dto, userId) {
        this.logger.log(`Creating campaign: ${dto.name} by user ${userId}`);
        let template = null;
        if (dto.templateId) {
            template = await this.prisma.template.findUnique({
                where: { id: dto.templateId },
            });
            if (!template) {
                throw new common_1.NotFoundException('Template not found');
            }
        }
        let totalRecipients = 0;
        if (dto.targetType === client_1.TargetType.ALL_USERS) {
            totalRecipients = await this.prisma.user.count({
                where: { marketingConsent: true },
            });
        }
        else if (dto.targetType === client_1.TargetType.FILTERED && dto.filters) {
            totalRecipients = await this.countTargetedUsers(dto.filters);
        }
        const estimatedCost = await this.estimateCost(dto.type, totalRecipients, dto.message.length);
        const campaign = await this.prisma.campaign.create({
            data: {
                name: dto.name,
                type: dto.type,
                subject: dto.subject,
                message: dto.message,
                templateId: dto.templateId,
                targetType: dto.targetType,
                filters: dto.filters,
                customListUrl: dto.customListUrl,
                sendNow: dto.sendNow,
                scheduledAt: dto.scheduledAt,
                totalRecipients,
                estimatedCost,
                createdBy: userId,
            },
            include: {
                template: true,
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
        if (campaign.sendNow) {
            try {
                await this.sendCampaign(campaign.id);
                return this.prisma.campaign.findUnique({
                    where: { id: campaign.id },
                    include: {
                        template: true,
                        creator: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                });
            }
            catch (error) {
                this.logger.error(`Failed to auto-send campaign ${campaign.id}:`, error);
            }
        }
        return campaign;
    }
    async getCampaigns(filters, pagination) {
        const where = {};
        if (filters?.type) {
            where.type = filters.type;
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        return this.prisma.campaign.findMany({
            where,
            skip: pagination?.skip || 0,
            take: pagination?.take || 20,
            orderBy: { createdAt: 'desc' },
            include: {
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                template: true,
                _count: {
                    select: {
                        recipients: true,
                    },
                },
            },
        });
    }
    async getCampaign(id) {
        const campaign = await this.prisma.campaign.findUnique({
            where: { id },
            include: {
                creator: true,
                template: true,
                recipients: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                phoneNumber: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        if (!campaign) {
            throw new common_1.NotFoundException('Campaign not found');
        }
        return campaign;
    }
    async deleteCampaign(id) {
        const campaign = await this.prisma.campaign.findUnique({ where: { id } });
        if (!campaign) {
            throw new common_1.NotFoundException('Campaign not found');
        }
        if (['SENDING', 'COMPLETED'].includes(campaign.status)) {
            throw new common_1.BadRequestException('Cannot delete campaign in SENDING or COMPLETED status');
        }
        await this.prisma.campaign.delete({ where: { id } });
        this.logger.log(`Campaign ${id} deleted`);
    }
    async sendCampaign(id) {
        const campaign = await this.prisma.campaign.findUnique({
            where: { id },
            include: { template: true },
        });
        if (!campaign) {
            throw new common_1.NotFoundException('Campaign not found');
        }
        if (campaign.status !== 'DRAFT' && campaign.status !== 'SCHEDULED') {
            throw new common_1.BadRequestException('Campaign already sent or in progress');
        }
        const recipientsCount = await this.prisma.campaignRecipient.count({
            where: { campaignId: id },
        });
        if (recipientsCount === 0) {
            await this.createRecipients(campaign);
        }
        await this.campaignQueue.add('send-campaign', { campaignId: id });
        this.logger.log(`Campaign ${id} queued for sending (${recipientsCount} recipients)`);
    }
    async sendTestCampaign(id, recipient) {
        const campaign = await this.prisma.campaign.findUnique({
            where: { id },
        });
        if (!campaign) {
            throw new common_1.NotFoundException('Campaign not found');
        }
        if (campaign.type === client_1.CampaignType.SMS) {
            await this.notificationsService.sendSms(recipient, campaign.message, true);
            this.logger.log(`Test SMS sent to ${recipient}`);
        }
        else {
            await this.notificationsService.sendEmail(recipient, campaign.subject || 'Test', campaign.message, true);
            this.logger.log(`Test Email sent to ${recipient}`);
        }
    }
    async getCampaignStats(id) {
        const campaign = await this.prisma.campaign.findUnique({
            where: { id },
        });
        if (!campaign) {
            throw new common_1.NotFoundException('Campaign not found');
        }
        const deliveryRate = campaign.sentCount > 0 ? (campaign.deliveredCount / campaign.sentCount) * 100 : 0;
        const openRate = campaign.deliveredCount > 0 ? (campaign.openedCount / campaign.deliveredCount) * 100 : 0;
        const clickRate = campaign.openedCount > 0 ? (campaign.clickedCount / campaign.openedCount) * 100 : 0;
        return {
            totalRecipients: campaign.totalRecipients,
            sentCount: campaign.sentCount,
            deliveredCount: campaign.deliveredCount,
            failedCount: campaign.failedCount,
            openedCount: campaign.openedCount,
            clickedCount: campaign.clickedCount,
            deliveryRate: Number(deliveryRate.toFixed(2)),
            openRate: Number(openRate.toFixed(2)),
            clickRate: Number(clickRate.toFixed(2)),
        };
    }
    async previewTargetedUsers(filters) {
        const where = this.buildUserFilter(filters);
        return this.prisma.user.findMany({
            where,
            take: 10,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                email: true,
                kycStatus: true,
                wallet: {
                    select: {
                        balance: true,
                    },
                },
            },
        });
    }
    async countTargetedUsers(filters) {
        const where = this.buildUserFilter(filters);
        return this.prisma.user.count({ where });
    }
    buildUserFilter(filters) {
        const where = {
            marketingConsent: true,
        };
        if (filters.kycStatus) {
            where.kycStatus = filters.kycStatus;
        }
        if (filters.registeredAfter || filters.registeredBefore) {
            where.createdAt = {};
            if (filters.registeredAfter) {
                where.createdAt.gte = filters.registeredAfter;
            }
            if (filters.registeredBefore) {
                where.createdAt.lte = filters.registeredBefore;
            }
        }
        if (filters.balanceMin !== undefined || filters.balanceMax !== undefined) {
            where.wallet = {
                is: {
                    balance: {},
                },
            };
            if (filters.balanceMin !== undefined) {
                where.wallet.is.balance.gte = filters.balanceMin;
            }
            if (filters.balanceMax !== undefined) {
                where.wallet.is.balance.lte = filters.balanceMax;
            }
        }
        if (filters.hasInvestments) {
            where.investments = {
                some: {},
            };
        }
        if (filters.hasReferrals) {
            where.referrals = {
                some: {},
            };
        }
        if (filters.phonePrefix) {
            where.phoneNumber = {
                startsWith: filters.phonePrefix,
            };
        }
        return where;
    }
    async createTemplate(dto, userId) {
        const variables = dto.variables || (0, template_renderer_util_1.extractVariables)(dto.content);
        return this.prisma.template.create({
            data: {
                name: dto.name,
                description: dto.description,
                type: dto.type,
                subject: dto.subject,
                content: dto.content,
                contentHtml: dto.contentHtml,
                variables,
                createdBy: userId,
            },
        });
    }
    async getTemplates(type) {
        return this.prisma.template.findMany({
            where: {
                isActive: true,
                ...(type && { type }),
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateTemplate(id, dto) {
        const template = await this.prisma.template.findUnique({ where: { id } });
        if (!template) {
            throw new common_1.NotFoundException('Template not found');
        }
        return this.prisma.template.update({
            where: { id },
            data: dto,
        });
    }
    async deleteTemplate(id) {
        await this.prisma.template.delete({ where: { id } });
    }
    async createRecipients(campaign) {
        let recipients = [];
        if (campaign.targetType === client_1.TargetType.ALL_USERS) {
            const users = await this.prisma.user.findMany({
                where: { marketingConsent: true },
                include: { wallet: true },
            });
            recipients = users.map(user => ({
                campaignId: campaign.id,
                userId: user.id,
                phoneNumber: campaign.type === client_1.CampaignType.SMS ? user.phoneNumber : undefined,
                email: campaign.type === client_1.CampaignType.EMAIL ? user.email : undefined,
            }));
        }
        else if (campaign.targetType === client_1.TargetType.FILTERED && campaign.filters) {
            const where = this.buildUserFilter(campaign.filters);
            const users = await this.prisma.user.findMany({
                where,
                include: { wallet: true },
            });
            recipients = users.map(user => ({
                campaignId: campaign.id,
                userId: user.id,
                phoneNumber: campaign.type === client_1.CampaignType.SMS ? user.phoneNumber : undefined,
                email: campaign.type === client_1.CampaignType.EMAIL ? user.email : undefined,
            }));
        }
        if (recipients.length > 0) {
            await this.prisma.campaignRecipient.createMany({
                data: recipients,
            });
        }
        await this.prisma.campaign.update({
            where: { id: campaign.id },
            data: { totalRecipients: recipients.length },
        });
        this.logger.log(`Created ${recipients.length} recipients for campaign ${campaign.id}`);
        return recipients.length;
    }
    async estimateCost(type, recipientCount, messageLength) {
        if (type === client_1.CampaignType.SMS) {
            const smsCount = Math.ceil(messageLength / 160);
            return recipientCount * smsCount * 25;
        }
        else {
            return recipientCount * 5;
        }
    }
};
exports.MarketingService = MarketingService;
exports.MarketingService = MarketingService = MarketingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, bullmq_1.InjectQueue)('campaign')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        bullmq_2.Queue])
], MarketingService);
//# sourceMappingURL=marketing.service.js.map