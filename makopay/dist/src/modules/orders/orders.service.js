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
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma/prisma.service");
const client_1 = require("@prisma/client");
const investments_service_1 = require("../investments/investments.service");
const mlm_service_1 = require("../mlm/mlm.service");
const wallet_service_1 = require("../wallet/wallet.service");
const notifications_service_1 = require("../notifications/notifications.service");
let OrdersService = OrdersService_1 = class OrdersService {
    prisma;
    investmentsService;
    mlmService;
    walletService;
    notificationsService;
    logger = new common_1.Logger(OrdersService_1.name);
    constructor(prisma, investmentsService, mlmService, walletService, notificationsService) {
        this.prisma = prisma;
        this.investmentsService = investmentsService;
        this.mlmService = mlmService;
        this.walletService = walletService;
        this.notificationsService = notificationsService;
    }
    async create(userId, createOrderDto) {
        return this.prisma.$transaction(async (tx) => {
            let totalAmount = new client_1.Prisma.Decimal(0);
            const orderItemsData = [];
            for (const item of createOrderDto.items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                });
                if (!product) {
                    throw new common_1.NotFoundException(`Product ${item.productId} not found`);
                }
                if (product.stock < item.quantity) {
                    throw new common_1.BadRequestException(`Insufficient stock for product ${product.name}`);
                }
                const price = product.price;
                totalAmount = totalAmount.add(price.mul(item.quantity));
                await tx.product.update({
                    where: { id: product.id },
                    data: { stock: product.stock - item.quantity },
                });
                orderItemsData.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: price,
                });
            }
            const order = await tx.order.create({
                data: {
                    userId,
                    status: client_1.OrderStatus.PENDING,
                    totalAmount: totalAmount,
                    items: {
                        create: orderItemsData,
                    },
                },
                include: { items: true },
            });
            return order;
        });
    }
    async findAll(userId) {
        const where = userId ? { userId, deletedAt: null } : { deletedAt: null };
        return this.prisma.order.findMany({
            where,
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId) {
        const where = { id, deletedAt: null };
        if (userId) {
            where.userId = userId;
        }
        return this.prisma.order.findFirst({
            where,
            include: { items: { include: { product: true } } },
        });
    }
    async pay(id, userId) {
        return this.prisma.$transaction(async (tx) => {
            const result = await tx.order.updateMany({
                where: {
                    id,
                    userId,
                    status: client_1.OrderStatus.PENDING
                },
                data: { status: client_1.OrderStatus.PAID }
            });
            if (result.count === 0) {
                const order = await tx.order.findUnique({ where: { id } });
                if (!order) {
                    throw new common_1.NotFoundException('Order not found');
                }
                if (order.userId !== userId) {
                    throw new common_1.NotFoundException('Order not found');
                }
                if (order.status === client_1.OrderStatus.PAID) {
                    throw new common_1.BadRequestException('Order already paid');
                }
                throw new common_1.BadRequestException(`Order cannot be paid in status ${order.status}`);
            }
            const order = await tx.order.findUnique({
                where: { id },
                include: { items: { include: { product: true } } },
            });
            if (!order)
                throw new Error("Order vanished after update - should not happen");
            await this.walletService.debit(userId, order.totalAmount, client_1.WalletTransactionType.PURCHASE, client_1.LedgerSource.ORDER, order.id, 'COMPLETED', tx);
            this.logger.log(`Order ${id} paid. Triggering transactional workflows...`);
            await this.investmentsService.createInvestmentFromOrder(order.id, order.userId, order.items, tx);
            await tx.outboxEvent.create({
                data: {
                    aggregateType: 'ORDER',
                    aggregateId: order.id,
                    type: 'ORDER_PAID',
                    payload: {
                        orderId: order.id,
                        userId: order.userId,
                        totalAmount: order.totalAmount,
                        items: order.items.map(i => ({ productId: i.productId, quantity: i.quantity }))
                    },
                }
            });
            await this.notificationsService.sendOrderPaidNotification(userId, order.id, order.totalAmount.toString(), 'XAF', order.items.length);
            return order;
        });
    }
    async remove(id, userId, isAdmin) {
        const where = { id };
        if (!isAdmin) {
            where.userId = userId;
        }
        const order = await this.prisma.order.findFirst({ where });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return this.prisma.order.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        investments_service_1.InvestmentsService,
        mlm_service_1.MlmService,
        wallet_service_1.WalletService,
        notifications_service_1.NotificationsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map