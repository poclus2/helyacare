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
var WalletService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma/prisma.service");
const client_1 = require("@prisma/client");
const notifications_service_1 = require("../notifications/notifications.service");
const settings_service_1 = require("../settings/settings.service");
let WalletService = WalletService_1 = class WalletService {
    prisma;
    notificationsService;
    settingsService;
    logger = new common_1.Logger(WalletService_1.name);
    constructor(prisma, notificationsService, settingsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.settingsService = settingsService;
    }
    async getBalance(userId) {
        const wallet = await this.prisma.wallet.findUnique({
            where: { userId },
        });
        return wallet ? wallet.balance : new client_1.Prisma.Decimal(0);
    }
    async createWallet(userId) {
        return this.prisma.wallet.create({
            data: { userId }
        });
    }
    async getWallet(userId) {
        let wallet = await this.prisma.wallet.findUnique({
            where: { userId },
            include: { ledger: { orderBy: { createdAt: 'desc' }, take: 20 } }
        });
        if (!wallet) {
            wallet = await this.createWallet(userId);
        }
        const pendingDeposits = await this.prisma.depositRequest.findMany({
            where: { userId, status: 'PENDING' },
            orderBy: { createdAt: 'desc' }
        });
        return { ...wallet, pendingDeposits };
    }
    async credit(userId, amount, type, source, reference, tx) {
        const execute = async (prisma) => {
            let wallet = await prisma.wallet.findUnique({ where: { userId } });
            if (!wallet) {
                wallet = await prisma.wallet.create({ data: { userId } });
            }
            const newBalance = wallet.balance.add(amount);
            await prisma.wallet.update({
                where: { id: wallet.id },
                data: { balance: newBalance }
            });
            await prisma.walletLedger.create({
                data: {
                    walletId: wallet.id,
                    type,
                    source,
                    amount,
                    reference,
                    balanceAfter: newBalance,
                }
            });
            this.logger.log(`Credited ${amount} to user ${userId} (Type: ${type}, Source: ${source})`);
            return newBalance;
        };
        let finalBalance;
        if (tx) {
            finalBalance = await execute(tx);
        }
        else {
            finalBalance = await this.prisma.$transaction(execute);
        }
        const RATE_XOF = 655.957;
        const amountXof = amount.mul(RATE_XOF).toFixed(0);
        try {
            if (type === client_1.WalletTransactionType.DEPOSIT) {
                await this.notificationsService.sendDepositSuccessNotification(userId, amountXof, 'XAF', 'Bank/Crypto');
            }
            else if (type === client_1.WalletTransactionType.INVESTMENT_PAYOUT) {
                await this.notificationsService.sendPayoutNotification(userId, amountXof, 'XAF', 'Investment Yield');
            }
            else if (type === client_1.WalletTransactionType.MLM_COMMISSION) {
                await this.notificationsService.sendPayoutNotification(userId, amountXof, 'XAF', 'Network Commission');
            }
            else {
                const message = `Credit of ${amountXof} XAF received. Type: ${type}, Source: ${source}.`;
                await this.notificationsService.createInAppNotification(userId, 'Funds Received', message, 'SUCCESS');
            }
        }
        catch (e) {
            this.logger.error('Failed to send credit notification', e);
        }
        return finalBalance;
    }
    async debit(userId, amount, type, source, reference, status = 'COMPLETED', tx) {
        const execute = async (prisma) => {
            let wallet = await prisma.wallet.findUnique({ where: { userId } });
            if (!wallet) {
                throw new common_1.BadRequestException('Wallet not found');
            }
            if (wallet.balance.lt(amount)) {
                throw new common_1.BadRequestException('Insufficient funds');
            }
            const newBalance = wallet.balance.sub(amount);
            await prisma.wallet.update({
                where: { id: wallet.id },
                data: { balance: newBalance }
            });
            await prisma.walletLedger.create({
                data: {
                    walletId: wallet.id,
                    type,
                    source,
                    amount: amount.negated(),
                    status,
                    reference,
                    balanceAfter: newBalance,
                }
            });
            this.logger.log(`Debited ${amount} from user ${userId} (Type: ${type}, Source: ${source})`);
            return newBalance;
        };
        let finalBalance;
        if (tx) {
            finalBalance = await execute(tx);
        }
        else {
            finalBalance = await this.prisma.$transaction(execute);
        }
        const RATE_XOF = 655.957;
        const amountXof = amount.mul(RATE_XOF).toFixed(0);
        try {
            if (type === client_1.WalletTransactionType.WITHDRAWAL) {
                await this.notificationsService.sendWithdrawalRequestNotification(userId, amountXof, 'XAF');
            }
        }
        catch (e) {
            this.logger.error('Failed to send debit notification', e);
        }
        return finalBalance;
    }
    async createDepositRequest(userId, amount, method, payerPhoneNumber, currency = "XAF") {
        const referenceCode = `DEP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const req = await this.prisma.depositRequest.create({
            data: {
                userId,
                amount,
                method,
                payerPhoneNumber,
                currency,
                referenceCode,
            }
        });
        let displayAmount = amount.toString();
        let displayCurrency = currency;
        const RATE_XOF = 655.957;
        const amountXof = amount.mul(RATE_XOF).toFixed(0);
        await this.notificationsService.createInAppNotification(userId, 'Deposit Request', `Deposit request ${referenceCode} for ${amountXof} XAF initiated via ${method}.`, 'INFO');
        return req;
    }
    async requestWithdrawal(userId, amount, method, details) {
        const { withdrawalFeePercent } = await this.settingsService.getFees();
        const feeAmount = amount.mul(withdrawalFeePercent).div(100);
        const totalDebit = amount.add(feeAmount);
        return this.prisma.$transaction(async (tx) => {
            const wallet = await tx.wallet.findUnique({ where: { userId } });
            if (!wallet)
                throw new common_1.BadRequestException('Wallet not found');
            if (wallet.balance.lt(totalDebit)) {
                throw new common_1.BadRequestException(`Insufficient funds. Total required: ${totalDebit} (Amount: ${amount} + Fee: ${feeAmount})`);
            }
            const newBalance = wallet.balance.sub(totalDebit);
            await tx.wallet.update({
                where: { id: wallet.id },
                data: { balance: newBalance }
            });
            const withdrawalLedger = await tx.walletLedger.create({
                data: {
                    walletId: wallet.id,
                    type: client_1.WalletTransactionType.WITHDRAWAL,
                    source: client_1.LedgerSource.WITHDRAWAL,
                    amount: amount.negated(),
                    status: 'PENDING',
                    reference: details,
                    balanceAfter: wallet.balance.sub(amount),
                }
            });
            if (Number(feeAmount) > 0) {
                await tx.walletLedger.create({
                    data: {
                        walletId: wallet.id,
                        type: client_1.WalletTransactionType.ADJUSTMENT,
                        source: client_1.LedgerSource.ADMIN,
                        amount: feeAmount.negated(),
                        status: 'COMPLETED',
                        reference: `FEE-${withdrawalLedger.id} (${withdrawalFeePercent}%)`,
                        balanceAfter: newBalance,
                    }
                });
            }
            else {
                await tx.walletLedger.update({
                    where: { id: withdrawalLedger.id },
                    data: { balanceAfter: newBalance }
                });
            }
            if (Number(feeAmount) > 0) {
                await tx.walletLedger.update({
                    where: { id: withdrawalLedger.id },
                    data: { balanceAfter: wallet.balance.sub(amount) }
                });
            }
            const RATE_XOF = 655.957;
            const amountXof = amount.mul(RATE_XOF).toFixed(0);
            try {
                await this.notificationsService.sendWithdrawalRequestNotification(userId, amountXof, 'XAF');
            }
            catch (e) {
                this.logger.error('Failed to send withdrawal notification', e);
            }
            return withdrawalLedger;
        });
    }
    async getPendingWithdrawals() {
        return this.prisma.walletLedger.findMany({
            where: {
                type: client_1.WalletTransactionType.WITHDRAWAL,
                status: 'PENDING'
            },
            include: {
                wallet: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                phoneNumber: true,
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async approveWithdrawal(ledgerId) {
        return this.prisma.walletLedger.update({
            where: { id: ledgerId },
            data: { status: 'COMPLETED' }
        });
    }
    async rejectWithdrawal(ledgerId) {
        return this.prisma.$transaction(async (tx) => {
            const ledger = await tx.walletLedger.findUnique({
                where: { id: ledgerId },
                include: { wallet: true }
            });
            if (!ledger || ledger.status !== 'PENDING') {
                throw new common_1.BadRequestException('Withdrawal not found or already processed');
            }
            const refundAmount = ledger.amount.abs();
            const newBalance = ledger.wallet.balance.add(refundAmount);
            await tx.wallet.update({
                where: { id: ledger.wallet.id },
                data: { balance: newBalance }
            });
            await tx.walletLedger.update({
                where: { id: ledgerId },
                data: { status: 'REJECTED' }
            });
            await tx.walletLedger.create({
                data: {
                    walletId: ledger.wallet.id,
                    type: client_1.WalletTransactionType.WITHDRAWAL,
                    source: client_1.LedgerSource.ADMIN,
                    amount: refundAmount,
                    balanceAfter: newBalance,
                    status: 'COMPLETED',
                    reference: `REFUND-${ledger.reference}`
                }
            });
            return { success: true };
        });
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = WalletService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        settings_service_1.SettingsService])
], WalletService);
//# sourceMappingURL=wallet.service.js.map