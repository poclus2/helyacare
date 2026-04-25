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
var InvestmentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma/prisma.service");
const client_1 = require("@prisma/client");
const schedule_1 = require("@nestjs/schedule");
const wallet_service_1 = require("../wallet/wallet.service");
const notifications_service_1 = require("../notifications/notifications.service");
let InvestmentsService = InvestmentsService_1 = class InvestmentsService {
    prisma;
    walletService;
    notificationsService;
    logger = new common_1.Logger(InvestmentsService_1.name);
    constructor(prisma, walletService, notificationsService) {
        this.prisma = prisma;
        this.walletService = walletService;
        this.notificationsService = notificationsService;
    }
    async createPlan(data) {
        return this.prisma.investmentPlan.create({
            data: {
                ...data,
                yieldPercent: new client_1.Prisma.Decimal(data.yieldPercent),
                minAmount: new client_1.Prisma.Decimal(data.minAmount),
                maxAmount: data.maxAmount ? new client_1.Prisma.Decimal(data.maxAmount) : null,
            }
        });
    }
    async updatePlan(id, data) {
        const updateData = { ...data };
        if (typeof data.yieldPercent === 'number') {
            updateData.yieldPercent = new client_1.Prisma.Decimal(data.yieldPercent);
        }
        if (typeof data.minAmount === 'number') {
            updateData.minAmount = new client_1.Prisma.Decimal(data.minAmount);
        }
        if (typeof data.maxAmount === 'number') {
            updateData.maxAmount = new client_1.Prisma.Decimal(data.maxAmount);
        }
        return this.prisma.investmentPlan.update({
            where: { id },
            data: updateData,
        });
    }
    async deletePlan(id) {
        return this.prisma.investmentPlan.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async findAllPlans() {
        return this.prisma.investmentPlan.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findPlanById(id) {
        const plan = await this.prisma.investmentPlan.findUnique({
            where: { id },
        });
        if (!plan || plan.deletedAt)
            throw new common_1.NotFoundException('Plan not found');
        return plan;
    }
    async findAllInvestments(userId) {
        return this.prisma.investment.findMany({
            where: { userId, deletedAt: null },
            include: { plan: true, payouts: true },
        });
    }
    async findAllInvestmentsAdmin(search, status) {
        const where = { deletedAt: null };
        if (status) {
            where.status = status;
        }
        if (search && search.trim()) {
            where.OR = [
                { user: { firstName: { contains: search, mode: 'insensitive' } } },
                { user: { lastName: { contains: search, mode: 'insensitive' } } },
                { user: { referralCode: { contains: search, mode: 'insensitive' } } },
            ];
        }
        return this.prisma.investment.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        referralCode: true,
                    }
                },
                plan: true,
                payouts: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getInvestmentStats() {
        const [active, completed, totalVolumeResult] = await Promise.all([
            this.prisma.investment.count({
                where: { status: client_1.InvestmentStatus.ACTIVE, deletedAt: null }
            }),
            this.prisma.investment.count({
                where: { status: client_1.InvestmentStatus.COMPLETED, deletedAt: null }
            }),
            this.prisma.investment.aggregate({
                where: { deletedAt: null },
                _sum: { principalAmount: true }
            })
        ]);
        return {
            activeCount: active,
            completedCount: completed,
            totalVolume: totalVolumeResult._sum.principalAmount || 0,
        };
    }
    async createInvestmentFromOrder(orderId, userId, items, tx) {
        const client = tx || this.prisma;
        this.logger.log(`Checking for investment products in order ${orderId}`);
        for (const item of items) {
            if (item.product && item.product.investmentPlanId) {
                const plan = await client.investmentPlan.findUnique({
                    where: { id: item.product.investmentPlanId }
                });
                if (!plan) {
                    this.logger.warn(`Plan ${item.product.investmentPlanId} not found for product ${item.product.id}`);
                    continue;
                }
                const principal = new client_1.Prisma.Decimal(item.unitPrice).mul(item.quantity);
                const startDate = new Date();
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + plan.durationDays);
                await client.investment.create({
                    data: {
                        userId,
                        orderId,
                        planId: item.product.investmentPlanId,
                        principalAmount: principal,
                        status: client_1.InvestmentStatus.ACTIVE,
                        startDate: startDate,
                        endDate: endDate,
                    }
                });
                await this.notificationsService.sendInvestmentStartedNotification(userId, plan.name, principal.toString(), 'XAF', endDate);
                this.logger.log(`Created investment for user ${userId} with plan ${item.product.investmentPlanId}`);
            }
        }
    }
    async handleHourlyPayouts() {
        this.logger.log('Running hourly payout calculation...');
        const activeInvestments = await this.prisma.investment.findMany({
            where: {
                status: client_1.InvestmentStatus.ACTIVE,
                deletedAt: null,
                plan: { payoutFrequency: client_1.PayoutFrequency.HOURLY }
            },
            include: { plan: true }
        });
        for (const inv of activeInvestments) {
            const hourlyRate = inv.plan.yieldPercent.div(30).div(24).div(100);
            await this.processPayout(inv, hourlyRate);
        }
    }
    async handleDailyPayouts() {
        this.logger.log('Running daily payout calculation...');
        const activeInvestments = await this.prisma.investment.findMany({
            where: {
                status: client_1.InvestmentStatus.ACTIVE,
                deletedAt: null,
                plan: { payoutFrequency: { not: client_1.PayoutFrequency.HOURLY } }
            },
            include: { plan: true }
        });
        for (const inv of activeInvestments) {
            const dailyRate = inv.plan.yieldPercent.div(30).div(100);
            await this.processPayout(inv, dailyRate);
        }
    }
    async processPayout(inv, rate) {
        const payoutAmount = inv.principalAmount.mul(rate);
        if (payoutAmount.lessThanOrEqualTo(0))
            return;
        await this.prisma.investmentPayout.create({
            data: {
                investmentId: inv.id,
                amount: payoutAmount,
                payoutDate: new Date(),
            }
        });
        await this.walletService.credit(inv.userId, payoutAmount, client_1.WalletTransactionType.INVESTMENT_PAYOUT, client_1.LedgerSource.INVESTMENT, inv.id);
        await this.prisma.investment.update({
            where: { id: inv.id },
            data: { lastPayoutAt: new Date() }
        });
        this.logger.log(`Paid ${payoutAmount} to investment ${inv.id}`);
    }
};
exports.InvestmentsService = InvestmentsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvestmentsService.prototype, "handleHourlyPayouts", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvestmentsService.prototype, "handleDailyPayouts", null);
exports.InvestmentsService = InvestmentsService = InvestmentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        wallet_service_1.WalletService,
        notifications_service_1.NotificationsService])
], InvestmentsService);
//# sourceMappingURL=investments.service.js.map