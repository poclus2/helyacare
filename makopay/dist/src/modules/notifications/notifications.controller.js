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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const notifications_service_1 = require("./notifications.service");
const class_validator_1 = require("class-validator");
const welcome_template_1 = require("./templates/email/welcome.template");
const otp_template_1 = require("./templates/sms/otp.template");
class TestEmailDto {
    to;
    name;
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], TestEmailDto.prototype, "to", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TestEmailDto.prototype, "name", void 0);
class TestSmsDto {
    phoneNumber;
    name;
}
__decorate([
    (0, class_validator_1.IsPhoneNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TestSmsDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TestSmsDto.prototype, "name", void 0);
let NotificationsController = class NotificationsController {
    notificationsService;
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async sendTestEmail(dto) {
        const html = (0, welcome_template_1.WelcomeEmailTemplate)(dto.name);
        return await this.notificationsService.sendEmail(dto.to, 'Welcome to MakoPay (Test)', html);
    }
    async sendTestSms(dto) {
        const message = (0, otp_template_1.WelcomeSmsTemplate)(dto.name);
        return await this.notificationsService.sendSms(dto.phoneNumber, message);
    }
    async sendTestWhatsApp(dto) {
        const message = (0, otp_template_1.WelcomeSmsTemplate)(dto.name);
        return await this.notificationsService.sendWhatsApp(dto.phoneNumber, message);
    }
    async getUserNotifications(req) {
        const userId = req.user.id;
        const notifications = await this.notificationsService.getUserNotifications(userId);
        const unreadCount = await this.notificationsService.getUnreadCount(userId);
        return { notifications, unreadCount };
    }
    async markAsRead(id, req) {
        return await this.notificationsService.markAsRead(id, req.user.id);
    }
    async markAllAsRead(req) {
        return await this.notificationsService.markAllAsRead(req.user.id);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Post)('test-email'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TestEmailDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendTestEmail", null);
__decorate([
    (0, common_1.Post)('test-sms'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TestSmsDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendTestSms", null);
__decorate([
    (0, common_1.Post)('test-whatsapp'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TestSmsDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendTestWhatsApp", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getUserNotifications", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Patch)(':id/read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Patch)('read-all'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAllAsRead", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map