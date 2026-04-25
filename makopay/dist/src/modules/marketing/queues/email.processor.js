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
var EmailProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../core/database/prisma/prisma.service");
const resend_service_1 = require("../providers/resend.service");
const message_variables_util_1 = require("../utils/message-variables.util");
let EmailProcessor = EmailProcessor_1 = class EmailProcessor extends bullmq_1.WorkerHost {
    prisma;
    resendService;
    logger = new common_1.Logger(EmailProcessor_1.name);
    constructor(prisma, resendService) {
        super();
        this.prisma = prisma;
        this.resendService = resendService;
    }
    async process(job) {
        switch (job.name) {
            case 'send-message':
                return this.handleEmailSend(job);
            default:
                throw new Error(`Unknown job ${job.name}`);
        }
    }
    async handleEmailSend(job) {
        const { recipientId, subject, message, user, campaignId } = job.data;
        try {
            this.logger.log(`[Email] Sending to ${user.email}`);
            const finalSubject = (0, message_variables_util_1.replaceVariables)(subject || 'Message de Makopay', user);
            const finalMessage = (0, message_variables_util_1.replaceVariables)(message, user);
            const result = await this.resendService.sendEmail(user.email, finalSubject, finalMessage);
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
                        actualCost: { increment: 5 },
                    },
                });
                this.logger.log(`[Email] ✅ Sent to ${user.email}`);
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
                this.logger.error(`[Email] ❌ Failed for ${user.email}: ${result.error}`);
            }
        }
        catch (error) {
            this.logger.error(`[Email] Exception for ${user.email}:`, error);
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
exports.EmailProcessor = EmailProcessor;
exports.EmailProcessor = EmailProcessor = EmailProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('email'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        resend_service_1.ResendService])
], EmailProcessor);
//# sourceMappingURL=email.processor.js.map