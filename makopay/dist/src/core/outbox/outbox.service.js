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
var OutboxService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutboxService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../database/prisma/prisma.service");
const mlm_service_1 = require("../../modules/mlm/mlm.service");
let OutboxService = OutboxService_1 = class OutboxService {
    prisma;
    mlmService;
    logger = new common_1.Logger(OutboxService_1.name);
    isProcessing = false;
    constructor(prisma, mlmService) {
        this.prisma = prisma;
        this.mlmService = mlmService;
    }
    async processOutbox() {
        if (this.isProcessing)
            return;
        this.isProcessing = true;
        try {
            const events = await this.prisma.outboxEvent.findMany({
                where: { status: 'PENDING' },
                take: 50,
                orderBy: { createdAt: 'asc' },
            });
            if (events.length === 0) {
                this.isProcessing = false;
                return;
            }
            this.logger.log(`Processing ${events.length} outbox events...`);
            for (const event of events) {
                await this.processEvent(event);
            }
        }
        catch (error) {
            this.logger.error('Error processing outbox', error);
        }
        finally {
            this.isProcessing = false;
        }
    }
    async processEvent(event) {
        try {
            await this.prisma.outboxEvent.update({
                where: { id: event.id },
                data: { status: 'PROCESSING' },
            });
            switch (event.type) {
                case 'ORDER_PAID':
                    await this.handleOrderPaid(event.payload);
                    break;
                default:
                    this.logger.warn(`Unknown event type: ${event.type}`);
            }
            await this.prisma.outboxEvent.update({
                where: { id: event.id },
                data: {
                    status: 'COMPLETED',
                    processedAt: new Date()
                },
            });
        }
        catch (error) {
            this.logger.error(`Failed to process event ${event.id}`, error);
            await this.prisma.outboxEvent.update({
                where: { id: event.id },
                data: { status: 'FAILED' },
            });
        }
    }
    async handleOrderPaid(payload) {
        const { orderId, userId, totalAmount } = payload;
        this.logger.log(`Handling ORDER_PAID for order ${orderId} (User: ${userId}, Amount: ${totalAmount})`);
        await this.mlmService.distributeCommissions(orderId, userId, totalAmount);
    }
};
exports.OutboxService = OutboxService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OutboxService.prototype, "processOutbox", null);
exports.OutboxService = OutboxService = OutboxService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mlm_service_1.MlmService])
], OutboxService);
//# sourceMappingURL=outbox.service.js.map