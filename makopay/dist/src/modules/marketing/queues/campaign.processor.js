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
var CampaignProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../core/database/prisma/prisma.service");
const bullmq_3 = require("@nestjs/bullmq");
let CampaignProcessor = CampaignProcessor_1 = class CampaignProcessor extends bullmq_1.WorkerHost {
    prisma;
    smsQueue;
    emailQueue;
    logger = new common_1.Logger(CampaignProcessor_1.name);
    constructor(prisma, smsQueue, emailQueue) {
        super();
        this.prisma = prisma;
        this.smsQueue = smsQueue;
        this.emailQueue = emailQueue;
    }
    async process(job) {
        switch (job.name) {
            case 'send-campaign':
                return this.handleCampaignSend(job);
            case 'check-completion':
                return this.handleCampaignCompletion(job);
            default:
                throw new Error(`Unknown job ${job.name}`);
        }
    }
    async handleCampaignSend(job) {
        const { campaignId } = job.data;
        this.logger.log(`[Campaign ${campaignId}] Starting processing`);
        try {
            const campaign = await this.prisma.campaign.findUnique({
                where: { id: campaignId },
            });
            if (!campaign) {
                throw new Error(`Campaign ${campaignId} not found`);
            }
            await this.prisma.campaign.update({
                where: { id: campaignId },
                data: { status: 'SENDING', sentAt: new Date() },
            });
            const recipients = await this.prisma.campaignRecipient.findMany({
                where: {
                    campaignId,
                    status: 'PENDING',
                },
                include: {
                    user: {
                        include: { wallet: true },
                    },
                },
            });
            this.logger.log(`[Campaign ${campaignId}] Found ${recipients.length} recipients`);
            if (recipients.length === 0) {
                await this.prisma.campaign.update({
                    where: { id: campaignId },
                    data: { status: 'COMPLETED' },
                });
                return { processed: 0 };
            }
            const queue = campaign.type === 'SMS' ? this.smsQueue : this.emailQueue;
            for (const recipient of recipients) {
                await queue.add('send-message', {
                    recipientId: recipient.id,
                    campaignId: campaign.id,
                    type: campaign.type,
                    subject: campaign.subject,
                    message: campaign.message,
                    user: recipient.user,
                });
            }
            this.logger.log(`[Campaign ${campaignId}] Queued ${recipients.length} messages`);
            return { processed: recipients.length };
        }
        catch (error) {
            this.logger.error(`[Campaign ${campaignId}] Error:`, error);
            await this.prisma.campaign.update({
                where: { id: campaignId },
                data: { status: 'FAILED' },
            });
            throw error;
        }
    }
    async handleCampaignCompletion(job) {
        const { campaignId } = job.data;
        const recipients = await this.prisma.campaignRecipient.findMany({
            where: { campaignId },
        });
        const pending = recipients.filter(r => r.status === 'PENDING').length;
        if (pending === 0) {
            await this.prisma.campaign.update({
                where: { id: campaignId },
                data: { status: 'COMPLETED' },
            });
            this.logger.log(`[Campaign ${campaignId}] Completed`);
        }
    }
};
exports.CampaignProcessor = CampaignProcessor;
exports.CampaignProcessor = CampaignProcessor = CampaignProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('campaign'),
    __param(1, (0, bullmq_3.InjectQueue)('sms')),
    __param(2, (0, bullmq_3.InjectQueue)('email')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bullmq_2.Queue,
        bullmq_2.Queue])
], CampaignProcessor);
//# sourceMappingURL=campaign.processor.js.map