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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOne(phoneNumber) {
        return this.prisma.user.findUnique({
            where: { phoneNumber },
        });
    }
    async findByEmail(email) {
        return this.prisma.user.findFirst({ where: { email } });
    }
    async findByReferralCode(referralCode) {
        return this.prisma.user.findUnique({ where: { referralCode } });
    }
    async findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }
    async create(data) {
        return this.prisma.user.create({
            data,
        });
    }
    async update(id, data) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }
    async submitKyc(userId, kycData) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                kycData,
                kycStatus: 'PENDING',
                kycSubmittedAt: new Date()
            }
        });
    }
    async getPendingKycUsers() {
        return this.prisma.user.findMany({
            where: { kycStatus: 'PENDING' },
            orderBy: { kycSubmittedAt: 'desc' },
            include: {
                wallet: true
            }
        });
    }
    async updateKycStatus(userId, status) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { kycStatus: status }
        });
    }
    async deleteUserFull(userId) {
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id: userId },
                select: { id: true, sponsorId: true, wallet: { select: { id: true } } }
            });
            if (!user) {
                throw new Error('User not found');
            }
            await tx.user.updateMany({
                where: { sponsorId: userId },
                data: { sponsorId: user.sponsorId }
            });
            await tx.mlmCommission.deleteMany({
                where: {
                    OR: [
                        { earnerId: userId },
                        { buyerId: userId }
                    ]
                }
            });
            const userInvestments = await tx.investment.findMany({
                where: { userId: userId },
                select: { id: true }
            });
            const investmentIds = userInvestments.map(inv => inv.id);
            if (investmentIds.length > 0) {
                await tx.investmentPayout.deleteMany({
                    where: { investmentId: { in: investmentIds } }
                });
                await tx.investment.deleteMany({
                    where: { id: { in: investmentIds } }
                });
            }
            if (user.wallet) {
                await tx.walletLedger.deleteMany({
                    where: { walletId: user.wallet.id }
                });
                await tx.wallet.delete({
                    where: { id: user.wallet.id }
                });
            }
            const userOrders = await tx.order.findMany({
                where: { userId: userId },
                select: { id: true }
            });
            const orderIds = userOrders.map(o => o.id);
            if (orderIds.length > 0) {
                await tx.mlmCommission.deleteMany({
                    where: { orderId: { in: orderIds } }
                });
                await tx.orderItem.deleteMany({
                    where: { orderId: { in: orderIds } }
                });
                await tx.order.deleteMany({
                    where: { id: { in: orderIds } }
                });
            }
            await tx.depositRequest.deleteMany({
                where: { userId: userId }
            });
            await tx.notification.deleteMany({
                where: { userId: userId }
            });
            await tx.supportMessage.deleteMany({
                where: { senderId: userId }
            });
            await tx.supportConversation.deleteMany({
                where: { userId: userId }
            });
            await tx.supportConversation.updateMany({
                where: { assignedToId: userId },
                data: { assignedToId: null }
            });
            return tx.user.delete({
                where: { id: userId }
            });
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map