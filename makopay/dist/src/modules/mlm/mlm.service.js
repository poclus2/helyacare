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
var MlmService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MlmService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma/prisma.service");
const client_1 = require("@prisma/client");
const wallet_service_1 = require("../wallet/wallet.service");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
let MlmService = MlmService_1 = class MlmService {
    prisma;
    walletService;
    mlmQueue;
    logger = new common_1.Logger(MlmService_1.name);
    COMMISSION_RATES = {
        1: 10,
        2: 5,
        3: 2,
    };
    constructor(prisma, walletService, mlmQueue) {
        this.prisma = prisma;
        this.walletService = walletService;
        this.mlmQueue = mlmQueue;
    }
    async getNetwork(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                referrals: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        kycStatus: true,
                        createdAt: true,
                        referrals: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                                kycStatus: true,
                                createdAt: true,
                                referrals: {
                                    select: {
                                        id: true,
                                        email: true,
                                        firstName: true,
                                        lastName: true,
                                        kycStatus: true,
                                        createdAt: true,
                                    }
                                }
                            }
                        }
                    }
                },
                sponsor: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                },
                wallet: {
                    select: {
                        id: true
                    }
                }
            }
        });
        let commissionsReceived = [];
        if (user?.wallet) {
            const ledgerEntries = await this.prisma.walletLedger.findMany({
                where: {
                    walletId: user.wallet.id,
                    type: client_1.WalletTransactionType.MLM_COMMISSION,
                    status: 'COMPLETED'
                },
                select: {
                    amount: true,
                    createdAt: true,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            commissionsReceived = ledgerEntries;
        }
        return {
            ...user,
            commissionsReceived
        };
    }
    async handleCommissionDistributionJob(orderId, userId, amountInput) {
        const amount = new client_1.Prisma.Decimal(amountInput);
        this.logger.log(`Processing commission job for order ${orderId}, amount: ${amount}`);
        let currentUserId = userId;
        let level = 1;
        while (currentUserId && level <= 3) {
            const user = await this.prisma.user.findUnique({ where: { id: currentUserId } });
            if (!user || !user.sponsorId)
                break;
            const sponsor = await this.prisma.user.findUnique({ where: { id: user.sponsorId } });
            if (!sponsor)
                break;
            const rate = this.COMMISSION_RATES[level];
            if (rate) {
                const commissionAmount = amount.mul(rate).div(100);
                await this.prisma.mlmCommission.create({
                    data: {
                        earnerId: sponsor.id,
                        buyerId: userId,
                        orderId: orderId,
                        amount: commissionAmount,
                        level: level,
                    }
                });
                await this.walletService.credit(sponsor.id, commissionAmount, client_1.WalletTransactionType.MLM_COMMISSION, client_1.LedgerSource.MLM, orderId);
                this.logger.log(`Commission Level ${level}: Paid ${commissionAmount} to ${sponsor.email}`);
            }
            currentUserId = sponsor.id;
            level++;
        }
    }
    async distributeCommissions(orderId, userId, amount) {
        await this.mlmQueue.add('distribute_commission', {
            orderId,
            userId,
            amount: amount.toString()
        });
        this.logger.log(`Added distribute_commission job for order ${orderId}`);
    }
};
exports.MlmService = MlmService;
exports.MlmService = MlmService = MlmService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, bullmq_1.InjectQueue)('mlm')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        wallet_service_1.WalletService,
        bullmq_2.Queue])
], MlmService);
//# sourceMappingURL=mlm.service.js.map