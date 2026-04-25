import { SupportService } from './support.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { SupportStatus } from '@prisma/client';
export declare class SupportController {
    private readonly supportService;
    constructor(supportService: SupportService);
    uploadFile(file: any): Promise<{
        url: string;
        type: string;
        filename: any;
    }>;
    createTicket(req: any, dto: CreateTicketDto): Promise<{
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
    getMyTickets(req: any): Promise<({
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
    getAllTickets(): Promise<({
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
    getConversation(req: any, id: string): Promise<({
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
    assignTicket(id: string, req: any): Promise<{
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
