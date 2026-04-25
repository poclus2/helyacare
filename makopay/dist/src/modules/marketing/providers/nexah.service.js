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
var NexahService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NexahService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let NexahService = NexahService_1 = class NexahService {
    httpService;
    logger = new common_1.Logger(NexahService_1.name);
    apiUrl = process.env.NEXAH_API_URL || 'https://api.nexah.net/v1';
    apiKey = process.env.NEXAH_API_KEY;
    senderId = process.env.NEXAH_SENDER_ID || 'MAKOPAY';
    constructor(httpService) {
        this.httpService = httpService;
    }
    async sendSms(to, message) {
        try {
            const formattedPhone = to.replace('+', '');
            this.logger.log(`Sending SMS to ${formattedPhone} via Nexah`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.apiUrl}/sms/send`, {
                to: formattedPhone,
                message,
                sender_id: this.senderId,
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
            }));
            const { message_id } = response.data;
            this.logger.log(`SMS sent successfully to ${formattedPhone}: ${message_id}`);
            return {
                success: true,
                messageId: message_id,
            };
        }
        catch (error) {
            this.logger.error(`Failed to send SMS to ${to}:`, error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message,
            };
        }
    }
    async getBalance() {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.apiUrl}/account/balance`, {
                headers: { Authorization: `Bearer ${this.apiKey}` },
            }));
            const balance = response.data.balance || 0;
            this.logger.log(`Nexah balance: ${balance} XAF`);
            return balance;
        }
        catch (error) {
            this.logger.error('Failed to get Nexah balance:', error.message);
            return 0;
        }
    }
    calculateCost(messageCount) {
        return messageCount * 11;
    }
};
exports.NexahService = NexahService;
exports.NexahService = NexahService = NexahService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], NexahService);
//# sourceMappingURL=nexah.service.js.map