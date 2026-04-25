import { PrismaService } from '../../core/database/prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { SupportStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
export declare class SupportService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    createTicket(userId: string, dto: CreateTicketDto): Promise<{
        id: string;
        userId: string;
        status: import("@prisma/client").$Enums.SupportStatus;
        subject: string;
        category: import("@prisma/client").$Enums.SupportCategory;
        priority: import("@prisma/client").$Enums.SupportPriority;
        assignedToId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    sendMessage(senderId: string, conversationId: string, content: string, attachmentUrl?: string, attachmentType?: string): Promise<{
        sender: {
            id: string;
            firstName: string | null;
            lastName: string | null;
            role: import("@prisma/client").$Enums.UserRole;
        };
    } & {
        id: string;
        conversationId: string;
        senderId: string;
        content: string;
        attachmentUrl: string | null;
        attachmentType: string | null;
        read: boolean;
        createdAt: Date;
    }>;
    findAllForUser(userId: string): Promise<({
        messages: {
            id: string;
            conversationId: string;
            senderId: string;
            content: string;
            attachmentUrl: string | null;
            attachmentType: string | null;
            read: boolean;
            createdAt: Date;
        }[];
    } & {
        id: string;
        userId: string;
        status: import("@prisma/client").$Enums.SupportStatus;
        subject: string;
        category: import("@prisma/client").$Enums.SupportCategory;
        priority: import("@prisma/client").$Enums.SupportPriority;
        assignedToId: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findAllForAdmin(): Promise<({
        user: {
            email: string | null;
            firstName: string | null;
            lastName: string | null;
        };
        assignedTo: {
            firstName: string | null;
            lastName: string | null;
        } | null;
        messages: {
            id: string;
            conversationId: string;
            senderId: string;
            content: string;
            attachmentUrl: string | null;
            attachmentType: string | null;
            read: boolean;
            createdAt: Date;
        }[];
    } & {
        id: string;
        userId: string;
        status: import("@prisma/client").$Enums.SupportStatus;
        subject: string;
        category: import("@prisma/client").$Enums.SupportCategory;
        priority: import("@prisma/client").$Enums.SupportPriority;
        assignedToId: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<({
        user: {
            id: string;
            email: string | null;
            firstName: string | null;
            lastName: string | null;
        };
        assignedTo: {
            id: string;
            firstName: string | null;
            lastName: string | null;
        } | null;
        messages: ({
            sender: {
                id: string;
                firstName: string | null;
                lastName: string | null;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            conversationId: string;
            senderId: string;
            content: string;
            attachmentUrl: string | null;
            attachmentType: string | null;
            read: boolean;
            createdAt: Date;
        })[];
    } & {
        id: string;
        userId: string;
        status: import("@prisma/client").$Enums.SupportStatus;
        subject: string;
        category: import("@prisma/client").$Enums.SupportCategory;
        priority: import("@prisma/client").$Enums.SupportPriority;
        assignedToId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    updateStatus(id: string, status: SupportStatus): Promise<{
        id: string;
        userId: string;
        status: import("@prisma/client").$Enums.SupportStatus;
        subject: string;
        category: import("@prisma/client").$Enums.SupportCategory;
        priority: import("@prisma/client").$Enums.SupportPriority;
        assignedToId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    assignTicket(id: string, adminId: string): Promise<{
        id: string;
        userId: string;
        status: import("@prisma/client").$Enums.SupportStatus;
        subject: string;
        category: import("@prisma/client").$Enums.SupportCategory;
        priority: import("@prisma/client").$Enums.SupportPriority;
        assignedToId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
