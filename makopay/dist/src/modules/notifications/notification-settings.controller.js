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
exports.NotificationSettingsController = void 0;
const common_1 = require("@nestjs/common");
const notification_settings_service_1 = require("./notification-settings.service");
const notifications_service_1 = require("./notifications.service");
const class_validator_1 = require("class-validator");
const welcome_template_1 = require("./templates/email/welcome.template");
const otp_template_1 = require("./templates/sms/otp.template");
class UpdateSettingsDto {
    emailEnabled;
    smsEnabled;
}
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateSettingsDto.prototype, "emailEnabled", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateSettingsDto.prototype, "smsEnabled", void 0);
class TestEmailDto {
    to;
    name;
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
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
let NotificationSettingsController = class NotificationSettingsController {
    settingsService;
    notificationsService;
    constructor(settingsService, notificationsService) {
        this.settingsService = settingsService;
        this.notificationsService = notificationsService;
    }
    async getSettings() {
        return this.settingsService.getSettings();
    }
    async updateSettings(dto) {
        return this.settingsService.updateSettings(dto);
    }
    async sendTestEmail(dto) {
        const html = (0, welcome_template_1.WelcomeEmailTemplate)(dto.name);
        return await this.notificationsService.sendEmail(dto.to, 'Test Email from MakoPay', html, true);
    }
    async sendTestSms(dto) {
        const message = (0, otp_template_1.WelcomeSmsTemplate)(dto.name);
        return await this.notificationsService.sendSms(dto.phoneNumber, message, true);
    }
};
exports.NotificationSettingsController = NotificationSettingsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationSettingsController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateSettingsDto]),
    __metadata("design:returntype", Promise)
], NotificationSettingsController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Post)('test-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TestEmailDto]),
    __metadata("design:returntype", Promise)
], NotificationSettingsController.prototype, "sendTestEmail", null);
__decorate([
    (0, common_1.Post)('test-sms'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TestSmsDto]),
    __metadata("design:returntype", Promise)
], NotificationSettingsController.prototype, "sendTestSms", null);
exports.NotificationSettingsController = NotificationSettingsController = __decorate([
    (0, common_1.Controller)('admin/settings/notifications'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [notification_settings_service_1.NotificationSettingsService,
        notifications_service_1.NotificationsService])
], NotificationSettingsController);
//# sourceMappingURL=notification-settings.controller.js.map