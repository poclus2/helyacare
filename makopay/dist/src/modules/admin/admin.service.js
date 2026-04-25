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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma/prisma.service");
const wallet_service_1 = require("../wallet/wallet.service");
const users_service_1 = require("../users/users.service");
const settings_service_1 = require("../settings/settings.service");
let AdminService = class AdminService {
    prisma;
    walletService;
    usersService;
    settingsService;
    constructor(prisma, walletService, usersService, settingsService) {
        this.prisma = prisma;
        this.walletService = walletService;
        this.usersService = usersService;
        this.settingsService = settingsService;
    }
    async getStats() {
        const totalUsers = await this.prisma.user.count();
        const pendingDeposits = await this.prisma.depositRequest.count({
            where: { status: 'PENDING' }
        });
        const totalVolumeResult = await this.prisma.depositRequest.aggregate({
            _sum: { amount: true },
            where: { status: 'COMPLETED' }
        });
        return {
            totalUsers,
            pendingDeposits,
            totalVolume: totalVolumeResult._sum.amount || 0
        };
    }
    async getPendingDeposits() {
        return this.prisma.depositRequest.findMany({
            where: { status: 'PENDING' },
            include: { user: { select: { firstName: true, lastName: true, email: true, phoneNumber: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getPendingWithdrawals() {
        return this.walletService.getPendingWithdrawals();
    }
    async approveWithdrawal(ledgerId) {
        return this.walletService.approveWithdrawal(ledgerId);
    }
    async rejectWithdrawal(ledgerId) {
        return this.walletService.rejectWithdrawal(ledgerId);
    }
    async getUsers() {
        return this.prisma.user.findMany({
            include: {
                wallet: {
                    select: { balance: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getPendingKycUsers() {
        return this.usersService.getPendingKycUsers();
    }
    async updateKycStatus(userId, action) {
        const status = action === 'approve' ? 'VERIFIED' : 'REJECTED';
        return this.usersService.updateKycStatus(userId, status);
    }
    async approveDeposit(depositId) {
        const deposit = await this.prisma.depositRequest.findUniqueOrThrow({
            where: { id: depositId }
        });
        if (deposit.status !== 'PENDING') {
            throw new Error('Deposit is not pending');
        }
        const conversionRate = deposit.currency === 'XAF' ? 655.957 : 1;
        const amountInEUR = Number(deposit.amount) / conversionRate;
        const { depositFeePercent } = await this.settingsService.getFees();
        const feeAmount = amountInEUR * (depositFeePercent / 100);
        const netAmount = amountInEUR - feeAmount;
        await this.prisma.$transaction(async (tx) => {
            await tx.depositRequest.update({
                where: { id: depositId },
                data: { status: 'COMPLETED' }
            });
            let wallet = await tx.wallet.findUnique({ where: { userId: deposit.userId } });
            if (!wallet) {
                wallet = await tx.wallet.create({ data: { userId: deposit.userId } });
            }
            const newBalance = wallet.balance.add(netAmount);
            await tx.wallet.update({
                where: { id: wallet.id },
                data: { balance: newBalance }
            });
            await tx.walletLedger.create({
                data: {
                    walletId: wallet.id,
                    type: 'DEPOSIT',
                    source: 'ADMIN',
                    amount: netAmount,
                    reference: `${deposit.referenceCode} (Fee: ${depositFeePercent}%)`,
                    balanceAfter: newBalance,
                    status: 'COMPLETED'
                }
            });
        });
        return { success: true };
    }
    async rejectDeposit(depositId) {
        const deposit = await this.prisma.depositRequest.findUniqueOrThrow({
            where: { id: depositId }
        });
        if (deposit.status !== 'PENDING') {
            throw new Error('Deposit is not pending');
        }
        await this.prisma.depositRequest.update({
            where: { id: depositId },
            data: { status: 'REJECTED' }
        });
        return { success: true };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        wallet_service_1.WalletService,
        users_service_1.UsersService,
        settings_service_1.SettingsService])
], AdminService);
//# sourceMappingURL=admin.service.js.map