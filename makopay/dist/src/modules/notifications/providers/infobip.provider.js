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
var InfobipProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfobipProvider = void 0;
const common_1 = require("@nestjs/common");
const sdk_1 = require("@infobip-api/sdk");
let InfobipProvider = InfobipProvider_1 = class InfobipProvider {
    infobip;
    logger = new common_1.Logger(InfobipProvider_1.name);
    constructor() {
        if (process.env.INFOBIP_API_KEY && process.env.INFOBIP_BASE_URL) {
            this.infobip = new sdk_1.Infobip({
                baseUrl: process.env.INFOBIP_BASE_URL,
                apiKey: process.env.INFOBIP_API_KEY,
                authType: sdk_1.AuthType.ApiKey,
            });
        }
        else {
            this.logger.warn('INFOBIP_API_KEY or INFOBIP_BASE_URL not found in environment variables');
        }
    }
    async sendSms(to, message) {
        if (!this.infobip) {
            this.logger.error('Infobip client not initialized');
            return null;
        }
        try {
            const response = await this.infobip.channels.sms.send({
                messages: [
                    {
                        destinations: [{ to }],
                        from: process.env.INFOBIP_SENDER_ID || 'MakoPay',
                        text: message,
                    },
                ],
            });
            this.logger.log(`SMS sent to ${to}: ${response.data.messages?.[0]?.messageId}`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to send SMS to ${to}`, error);
            throw error;
        }
    }
    async sendWhatsApp(to, message) {
        if (!this.infobip) {
            this.logger.error('Infobip client not initialized');
            return null;
        }
        try {
            const response = await this.infobip.channels.whatsapp.send({
                from: process.env.INFOBIP_WHATSAPP_NUMBER,
                to: to,
                content: {
                    text: message
                }
            });
            this.logger.log(`WhatsApp sent to ${to}: ${response.data.messageId}`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to send WhatsApp to ${to}`, error);
            throw error;
        }
    }
};
exports.InfobipProvider = InfobipProvider;
exports.InfobipProvider = InfobipProvider = InfobipProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], InfobipProvider);
//# sourceMappingURL=infobip.provider.js.map