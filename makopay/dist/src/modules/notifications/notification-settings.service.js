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
exports.NotificationSettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma/prisma.service");
let NotificationSettingsService = class NotificationSettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings() {
        const emailEnabled = await this.prisma.systemSetting.findUnique({ where: { key: 'notifications.email.enabled' } });
        const smsEnabled = await this.prisma.systemSetting.findUnique({ where: { key: 'notifications.sms.enabled' } });
        return {
            emailEnabled: emailEnabled?.value === 'true',
            smsEnabled: smsEnabled?.value === 'true',
        };
    }
    async updateSettings(settings) {
        if (settings.emailEnabled !== undefined) {
            await this.prisma.systemSetting.upsert({
                where: { key: 'notifications.email.enabled' },
                update: { value: String(settings.emailEnabled) },
                create: { key: 'notifications.email.enabled', value: String(settings.emailEnabled), description: 'Enable/Disable Email Notifications' },
            });
        }
        if (settings.smsEnabled !== undefined) {
            await this.prisma.systemSetting.upsert({
                where: { key: 'notifications.sms.enabled' },
                update: { value: String(settings.smsEnabled) },
                create: { key: 'notifications.sms.enabled', value: String(settings.smsEnabled), description: 'Enable/Disable SMS Notifications' },
            });
        }
        return this.getSettings();
    }
};
exports.NotificationSettingsService = NotificationSettingsService;
exports.NotificationSettingsService = NotificationSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationSettingsService);
//# sourceMappingURL=notification-settings.service.js.map