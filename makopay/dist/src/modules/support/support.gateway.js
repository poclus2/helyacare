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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const support_service_1 = require("./support.service");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const ws_jwt_guard_1 = require("../../core/guards/ws-jwt.guard");
let SupportGateway = class SupportGateway {
    supportService;
    server;
    constructor(supportService) {
        this.supportService = supportService;
    }
    async handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    async handleJoinRoom(client, data) {
        const user = client.user;
        if (user && (user.id === data.userId || user.role === 'ADMIN' || user.role === 'SUPPORT')) {
            client.join(data.userId);
            return { event: 'joinedRoom', data: { room: data.userId } };
        }
    }
    async handleSendMessage(client, payload) {
        const user = client.user;
        const message = await this.supportService.sendMessage(user.id, payload.conversationId, payload.content, payload.attachmentUrl, payload.attachmentType);
        let roomToEmit = '';
        if (user.role === 'ADMIN' || user.role === 'SUPPORT') {
            const conversation = await this.supportService.findOne(payload.conversationId);
            if (conversation)
                roomToEmit = conversation.userId;
        }
        else {
            roomToEmit = user.id;
        }
        if (roomToEmit) {
            this.server.to(roomToEmit).emit('newMessage', message);
        }
        this.server.emit('admin:newMessage', message);
        return message;
    }
};
exports.SupportGateway = SupportGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SupportGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], SupportGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], SupportGateway.prototype, "handleSendMessage", null);
exports.SupportGateway = SupportGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        namespace: 'support',
    }),
    __metadata("design:paramtypes", [support_service_1.SupportService])
], SupportGateway);
//# sourceMappingURL=support.gateway.js.map