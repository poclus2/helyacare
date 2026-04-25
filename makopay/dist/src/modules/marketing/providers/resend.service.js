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
var ResendService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendService = void 0;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
let ResendService = ResendService_1 = class ResendService {
    logger = new common_1.Logger(ResendService_1.name);
    resend;
    fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@makopay.live';
    fromName = process.env.RESEND_FROM_NAME || 'Makopay';
    constructor() {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            this.logger.warn('RESEND_API_KEY not configured');
        }
        this.resend = new resend_1.Resend(apiKey);
    }
    async sendEmail(to, subject, message) {
        try {
            this.logger.log(`Sending email to ${to} via Resend`);
            const { data, error } = await this.resend.emails.send({
                from: `${this.fromName} <${this.fromEmail}>`,
                to: [to],
                subject,
                html: this.formatHtml(message),
                text: message,
            });
            if (error) {
                this.logger.error(`Failed to send email to ${to}:`, error);
                return {
                    success: false,
                    error: error.message,
                };
            }
            this.logger.log(`Email sent successfully to ${to}: ${data.id}`);
            return {
                success: true,
                messageId: data.id,
            };
        }
        catch (error) {
            this.logger.error(`Exception sending email to ${to}:`, error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    formatHtml(message) {
        return `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .header {
              background-color: #000000;
              color: #ffffff;
              padding: 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 30px;
            }
            .content p {
              margin: 0 0 15px 0;
            }
            .footer {
              background-color: #f8f8f8;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #eee;
            }
            .footer a {
              color: #000;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Makopay</h1>
            </div>
            <div class="content">
              ${message.split('\n').map(line => `<p>${line}</p>`).join('')}
            </div>
            <div class="footer">
              <p>Vous recevez cet email car vous êtes client Makopay</p>
              <p><a href="https://makopay.live">makopay.live</a></p>
            </div>
          </div>
        </body>
      </html>
    `;
    }
    calculateCost(emailCount) {
        if (emailCount <= 3000)
            return 0;
        return (emailCount - 3000) * 5;
    }
};
exports.ResendService = ResendService;
exports.ResendService = ResendService = ResendService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ResendService);
//# sourceMappingURL=resend.service.js.map