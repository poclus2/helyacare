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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var NexahSmsProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NexahSmsProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
const cameroon_operator_util_1 = require("../utils/cameroon-operator.util");
let NexahSmsProvider = NexahSmsProvider_1 = class NexahSmsProvider {
    configService;
    logger = new common_1.Logger(NexahSmsProvider_1.name);
    name = 'NEXAH';
    baseUrl;
    username;
    password;
    constructor(configService) {
        this.configService = configService;
        this.baseUrl = this.configService.get('NEXAH_API_URL', 'https://smsvas.com/bulk/public/index.php/api/v1');
        this.username = this.configService.get('NEXAH_USERNAME', '');
        this.password = this.configService.get('NEXAH_PASSWORD', '');
    }
    supports(phoneNumber) {
        return (0, cameroon_operator_util_1.isCameroonNumber)(phoneNumber);
    }
    async sendSms(to, message, isOtp = false) {
        if (!this.username || !this.password) {
            this.logger.error('NEXAH credentials not configured');
            return {
                success: false,
                error: 'NEXAH credentials missing',
                provider: this.name,
            };
        }
        const senderId = (0, cameroon_operator_util_1.getNexahSenderId)(to);
        this.logger.log(`Sending SMS via NEXAH to ${to} with sender ID: ${senderId}`);
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/sendsms`, {
                user: this.username,
                password: this.password,
                senderid: senderId,
                sms: message,
                mobiles: to.replace('+', ''),
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                timeout: 10000,
            });
            const data = response.data;
            if (data.responsecode === 1 && data.sms && data.sms.length > 0) {
                const smsResult = data.sms[0];
                if (smsResult.status === 'success') {
                    this.logger.log(`SMS sent successfully via NEXAH: ${smsResult.messageid}`);
                    return {
                        success: true,
                        messageId: smsResult.messageid,
                        provider: this.name,
                        details: {
                            senderId,
                            clientId: smsResult.smsclientid,
                        }
                    };
                }
                else {
                    this.logger.warn(`NEXAH SMS failed: ${smsResult.errordescription}`);
                    return {
                        success: false,
                        error: `${smsResult.errorcode}: ${smsResult.errordescription}`,
                        provider: this.name,
                    };
                }
            }
            else {
                this.logger.error(`NEXAH API error: ${data.responsemessage}`);
                return {
                    success: false,
                    error: data.responsemessage || 'Unknown NEXAH error',
                    provider: this.name,
                };
            }
        }
        catch (error) {
            this.logger.error(`NEXAH API call failed: ${error.message}`);
            return {
                success: false,
                error: error.response?.data?.responsemessage || error.message,
                provider: this.name,
            };
        }
    }
    async getBalance() {
        if (!this.username || !this.password) {
            this.logger.error('NEXAH credentials not configured');
            return null;
        }
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/smscredit`, {
                user: this.username,
                password: this.password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                timeout: 10000,
            });
            return {
                credit: response.data.credit,
                accountExpDate: response.data.accountexpdate,
                balanceExpDate: response.data.balanceexpdate,
            };
        }
        catch (error) {
            this.logger.error(`Failed to fetch NEXAH balance: ${error.message}`);
            return null;
        }
    }
};
exports.NexahSmsProvider = NexahSmsProvider;
exports.NexahSmsProvider = NexahSmsProvider = NexahSmsProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NexahSmsProvider);
//# sourceMappingURL=nexah-sms.provider.js.map