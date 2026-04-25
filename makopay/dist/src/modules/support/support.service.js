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
exports.SupportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let SupportService = class SupportService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async createTicket(userId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const conversation = await tx.supportConversation.create({
                data: {
                    userId,
                    subject: dto.subject,
                    category: dto.category,
                    priority: dto.priority,
                    status: 'OPEN',
                },
            });
            await tx.supportMessage.create({
                data: {
                    conversationId: conversation.id,
                    senderId: userId,
                    content: dto.initialMessage,
                },
            });
            return conversation;
        });
    }
    async sendMessage(senderId, conversationId, content, attachmentUrl, attachmentType) {
        const conversation = await this.prisma.supportConversation.findUnique({
            where: { id: conversationId },
        });
        if (!conversation)
            throw new common_1.NotFoundException('Conversation not found');
        const message = await this.prisma.supportMessage.create({
            data: {
                conversationId,
                senderId,
                content,
                attachmentUrl,
                attachmentType
            },
            include: {
                sender: {
                    select: { id: true, firstName: true, lastName: true, role: true }
                }
            }
        });
        await this.prisma.supportConversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() }
        });
        if (conversation.userId !== senderId) {
            await this.notificationsService.sendSupportReplyNotification(conversation.userId, conversation.subject, content || (attachmentUrl ? 'Sent an attachment' : 'New message'), conversation.id);
        }
        return message;
    }
    async findAllForUser(userId) {
        return this.prisma.supportConversation.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            include: {
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                }
            }
        });
    }
    async findAllForAdmin() {
        return this.prisma.supportConversation.findMany({
            orderBy: { updatedAt: 'desc' },
            include: {
                user: { select: { firstName: true, lastName: true, email: true } },
                assignedTo: { select: { firstName: true, lastName: true } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        });
    }
    async findOne(id) {
        return this.prisma.supportConversation.findUnique({
            where: { id },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                    include: { sender: { select: { id: true, firstName: true, lastName: true, role: true } } }
                },
                user: { select: { id: true, firstName: true, lastName: true, email: true } },
                assignedTo: { select: { id: true, firstName: true, lastName: true } }
            }
        });
    }
    async updateStatus(id, status) {
        return this.prisma.supportConversation.update({
            where: { id },
            data: { status }
        });
    }
    async assignTicket(id, adminId) {
        return this.prisma.supportConversation.update({
            where: { id },
            data: { assignedToId: adminId }
        });
    }
};
exports.SupportService = SupportService;
exports.SupportService = SupportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], SupportService);
//# sourceMappingURL=support.service.js.map