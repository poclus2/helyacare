import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SupportService } from './support.service';
import { Server, Socket } from 'socket.io';
export declare class SupportGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly supportService;
    server: Server;
    constructor(supportService: SupportService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(client: Socket, data: {
        userId: string;
    }): Promise<{
        event: string;
        data: {
            room: string;
        };
    } | undefined>;
    handleSendMessage(client: Socket, payload: {
        conversationId: string;
        content: string;
        targetUserId?: string;
        attachmentUrl?: string;
        attachmentType?: string;
    }): Promise<{
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
}
