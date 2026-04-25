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
var SmsProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../core/database/prisma/prisma.service");
const nexah_service_1 = require("../providers/nexah.service");
const message_variables_util_1 = require("../utils/message-variables.util");
let SmsProcessor = SmsProcessor_1 = class SmsProcessor extends bullmq_1.WorkerHost {
    prisma;
    nexahService;
    logger = new common_1.Logger(SmsProcessor_1.name);
    constructor(prisma, nexahService) {
        super();
        this.prisma = prisma;
        this.nexahService = nexahService;
    }
    async process(job) {
        switch (job.name) {
            case 'send-message':
                return this.handleSmsSend(job);
            default:
                throw new Error(`Unknown job ${job.name}`);
        }
    }
    async handleSmsSend(job) {
        const { recipientId, message, user, campaignId } = job.data;
        try {
            this.logger.log(`[SMS] Sending to ${user.phoneNumber}`);
            const finalMessage = (0, message_variables_util_1.replaceVariables)(message, user);
            const result = await this.nexahService.sendSms(user.phoneNumber, finalMessage);
            if (result.success) {
                await this.prisma.campaignRecipient.update({
                    where: { id: recipientId },
                    data: {
                        status: 'SENT',
                        sentAt: new Date(),
                    },
                });
                await this.prisma.campaign.update({
                    where: { id: campaignId },
                    data: {
                        sentCount: { increment: 1 },
                        actualCost: { increment: 11 },
                    },
                });
                this.logger.log(`[SMS] ✅ Sent to ${user.phoneNumber}`);
            }
            else {
                await this.prisma.campaignRecipient.update({
                    where: { id: recipientId },
                    data: {
                        status: 'FAILED',
                        error: result.error,
                    },
                });
                await this.prisma.campaign.update({
                    where: { id: campaignId },
                    data: { failedCount: { increment: 1 } },
                });
                this.logger.error(`[SMS] ❌ Failed for ${user.phoneNumber}: ${result.error}`);
            }
        }
        catch (error) {
            this.logger.error(`[SMS] Exception for ${user.phoneNumber}:`, error);
            await this.prisma.campaignRecipient.update({
                where: { id: recipientId },
                data: {
                    status: 'FAILED',
                    error: error.message,
                },
            });
            throw error;
        }
    }
};
exports.SmsProcessor = SmsProcessor;
exports.SmsProcessor = SmsProcessor = SmsProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('sms'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        nexah_service_1.NexahService])
], SmsProcessor);
//# sourceMappingURL=sms.processor.js.map