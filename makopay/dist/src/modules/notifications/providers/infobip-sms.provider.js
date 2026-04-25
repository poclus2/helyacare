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
var InfobipSmsProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfobipSmsProvider = void 0;
const common_1 = require("@nestjs/common");
const infobip_provider_1 = require("./infobip.provider");
let InfobipSmsProvider = InfobipSmsProvider_1 = class InfobipSmsProvider {
    infobipProvider;
    logger = new common_1.Logger(InfobipSmsProvider_1.name);
    name = 'Infobip';
    constructor(infobipProvider) {
        this.infobipProvider = infobipProvider;
    }
    supports(phoneNumber) {
        return true;
    }
    async sendSms(to, message, isOtp = false) {
        try {
            const result = await this.infobipProvider.sendSms(to, message);
            if (result) {
                this.logger.log(`SMS sent successfully via Infobip to ${to}`);
                return {
                    success: true,
                    messageId: result.messageId || 'infobip-success',
                    provider: this.name,
                };
            }
            else {
                this.logger.warn(`Infobip returned null/false for ${to}`);
                return {
                    success: false,
                    error: 'Infobip returned no result',
                    provider: this.name,
                };
            }
        }
        catch (error) {
            this.logger.error(`Infobip SMS failed: ${error.message}`);
            return {
                success: false,
                error: error.message,
                provider: this.name,
            };
        }
    }
};
exports.InfobipSmsProvider = InfobipSmsProvider;
exports.InfobipSmsProvider = InfobipSmsProvider = InfobipSmsProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [infobip_provider_1.InfobipProvider])
], InfobipSmsProvider);
//# sourceMappingURL=infobip-sms.provider.js.map