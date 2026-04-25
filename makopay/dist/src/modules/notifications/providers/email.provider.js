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
var EmailProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailProvider = void 0;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
let EmailProvider = EmailProvider_1 = class EmailProvider {
    resend;
    logger = new common_1.Logger(EmailProvider_1.name);
    constructor() {
        if (process.env.RESEND_API_KEY) {
            this.resend = new resend_1.Resend(process.env.RESEND_API_KEY);
        }
        else {
            this.logger.warn('RESEND_API_KEY not found in environment variables');
        }
    }
    async sendEmail(to, subject, html) {
        if (!this.resend) {
            this.logger.error('Resend client not initialized');
            return null;
        }
        try {
            const data = await this.resend.emails.send({
                from: process.env.EMAIL_FROM || 'MakoPay <noreply@makopay.com>',
                to: [to],
                subject: subject,
                html: html,
            });
            this.logger.log(`Email sent to ${to}: ${data.id || data.data?.id}`);
            return data;
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${to}`, error);
            throw error;
        }
    }
};
exports.EmailProvider = EmailProvider;
exports.EmailProvider = EmailProvider = EmailProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailProvider);
//# sourceMappingURL=email.provider.js.map