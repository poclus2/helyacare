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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const email_provider_1 = require("./providers/email.provider");
const infobip_provider_1 = require("./providers/infobip.provider");
const nexah_sms_provider_1 = require("./providers/nexah-sms.provider");
const infobip_sms_provider_1 = require("./providers/infobip-sms.provider");
const notification_settings_service_1 = require("./notification-settings.service");
const prisma_service_1 = require("../../core/database/prisma/prisma.service");
const deposit_received_template_1 = require("./templates/email/deposit-received.template");
const withdrawal_requested_template_1 = require("./templates/email/withdrawal-requested.template");
const investment_started_template_1 = require("./templates/email/investment-started.template");
const payout_received_template_1 = require("./templates/email/payout-received.template");
const order_paid_template_1 = require("./templates/email/order-paid.template");
const new_referral_template_1 = require("./templates/email/new-referral.template");
const support_reply_template_1 = require("./templates/email/support-reply.template");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    emailProvider;
    infobipProvider;
    nexahSmsProvider;
    infobipSmsProvider;
    settingsService;
    prisma;
    logger = new common_1.Logger(NotificationsService_1.name);
    smsProviders;
    constructor(emailProvider, infobipProvider, nexahSmsProvider, infobipSmsProvider, settingsService, prisma) {
        this.emailProvider = emailProvider;
        this.infobipProvider = infobipProvider;
        this.nexahSmsProvider = nexahSmsProvider;
        this.infobipSmsProvider = infobipSmsProvider;
        this.settingsService = settingsService;
        this.prisma = prisma;
        this.smsProviders = [
            this.nexahSmsProvider,
            this.infobipSmsProvider,
        ];
    }
    async sendEmail(to, subject, html, force = false) {
        if (!force) {
            const settings = await this.settingsService.getSettings();
            if (!settings.emailEnabled) {
                this.logger.log(`Email to ${to} skipped (Email notifications disabled)`);
                return null;
            }
        }
        return this.emailProvider.sendEmail(to, subject, html);
    }
    async sendSms(to, message, force = false) {
        if (!force) {
            const settings = await this.settingsService.getSettings();
            if (!settings.smsEnabled) {
                this.logger.log(`SMS to ${to} skipped (SMS notifications disabled)`);
                return null;
            }
        }
        for (const provider of this.smsProviders) {
            if (provider.supports(to)) {
                this.logger.log(`Attempting SMS via ${provider.name} to ${to}`);
                const result = await provider.sendSms(to, message, false);
                if (result.success) {
                    this.logger.log(`SMS sent successfully via ${provider.name}: ${result.messageId}`);
                    return result;
                }
                else {
                    this.logger.warn(`${provider.name} failed: ${result.error}. Trying next provider...`);
                }
            }
        }
        this.logger.error(`All SMS providers failed for ${to}`);
        return null;
    }
    async sendWhatsApp(to, message, force = false) {
        if (!force) {
            const settings = await this.settingsService.getSettings();
            if (!settings.smsEnabled) {
                this.logger.log(`WhatsApp to ${to} skipped (SMS/WhatsApp notifications disabled)`);
                return null;
            }
        }
        return this.infobipProvider.sendWhatsApp(to, message);
    }
    async sendOtp(to, code, channel = 'sms') {
        const message = `Your MakoPay verification code is: ${code}. Do not share this code.`;
        switch (channel) {
            case 'sms':
                return this.sendSms(to, message);
            case 'whatsapp':
                return this.sendWhatsApp(to, message);
            case 'email':
                return this.sendEmail(to, 'Verification Code', `<p>${message}</p>`);
            default:
                this.logger.error(`Unsupported channel: ${channel}`);
        }
    }
    async createInAppNotification(userId, title, message, type = 'INFO') {
        return this.prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
            }
        });
    }
    async getUserNotifications(userId) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
    }
    async getUnreadCount(userId) {
        return this.prisma.notification.count({
            where: { userId, read: false }
        });
    }
    async markAsRead(notificationId, userId) {
        const notification = await this.prisma.notification.findUnique({
            where: { id: notificationId }
        });
        if (!notification || notification.userId !== userId) {
            throw new common_1.NotFoundException('Notification not found');
        }
        return this.prisma.notification.update({
            where: { id: notificationId },
            data: { read: true }
        });
    }
    async sendDepositSuccessNotification(userId, amount, currency, method) {
        await this.createInAppNotification(userId, 'Funds Received', `Credit of ${amount} ${currency} received via ${method}.`, 'SUCCESS');
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user && user.email) {
            const html = (0, deposit_received_template_1.DepositReceivedTemplate)(user.firstName || 'User', amount, currency, method);
            await this.sendEmail(user.email, 'Deposit Confirmed', html);
        }
    }
    async sendWithdrawalRequestNotification(userId, amount, currency) {
        await this.createInAppNotification(userId, 'Withdrawal Request', `Withdrawal of ${amount} ${currency} requested.`, 'WARNING');
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user && user.email) {
            const html = (0, withdrawal_requested_template_1.WithdrawalRequestedTemplate)(user.firstName || 'User', amount, currency);
            await this.sendEmail(user.email, 'Withdrawal Request Received', html);
        }
    }
    async sendInvestmentStartedNotification(userId, planName, amount, currency, endDate) {
        await this.createInAppNotification(userId, 'Investment Confirmed', `Your investment of ${amount} ${currency} in ${planName} has started.`, 'SUCCESS');
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user && user.email) {
            const html = (0, investment_started_template_1.InvestmentStartedTemplate)(user.firstName || 'User', planName, amount, currency, endDate.toLocaleDateString());
            await this.sendEmail(user.email, 'Investment Started', html);
        }
    }
    async sendPayoutNotification(userId, amount, currency, source) {
        await this.createInAppNotification(userId, 'Funds Received', `Payout of ${amount} ${currency} received from ${source}.`, 'SUCCESS');
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user && user.email) {
            const html = (0, payout_received_template_1.PayoutReceivedTemplate)(user.firstName || 'User', amount, currency, source);
            await this.sendEmail(user.email, 'New Payout Received', html);
        }
    }
    async sendOrderPaidNotification(userId, orderId, amount, currency, itemCount) {
        await this.createInAppNotification(userId, 'Purchase Successful', `Order ${orderId} for ${amount} ${currency} confirmed.`, 'SUCCESS');
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user && user.email) {
            const html = (0, order_paid_template_1.OrderPaidTemplate)(user.firstName || 'User', orderId, amount, currency, itemCount);
            await this.sendEmail(user.email, 'Order Confirmed', html);
        }
    }
    async sendNewReferralNotification(sponsorId, newUserName) {
        await this.createInAppNotification(sponsorId, 'New Referral', `${newUserName} has joined your network!`, 'INFO');
        const sponsor = await this.prisma.user.findUnique({ where: { id: sponsorId } });
        if (sponsor && sponsor.email) {
            const html = (0, new_referral_template_1.NewReferralTemplate)(sponsor.firstName || 'Partner', newUserName);
            await this.sendEmail(sponsor.email, 'New Team Member', html);
        }
    }
    async sendSupportReplyNotification(userId, ticketSubject, messagePreview, ticketId) {
        await this.createInAppNotification(userId, 'Support Reply', `New reply on ticket: ${ticketSubject}`, 'INFO');
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user && user.email) {
            const html = (0, support_reply_template_1.SupportReplyTemplate)(user.firstName || 'User', ticketSubject, messagePreview, ticketId);
            await this.sendEmail(user.email, `Reply: ${ticketSubject}`, html);
        }
    }
    async markAllAsRead(userId) {
        return this.prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true }
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [email_provider_1.EmailProvider,
        infobip_provider_1.InfobipProvider,
        nexah_sms_provider_1.NexahSmsProvider,
        infobip_sms_provider_1.InfobipSmsProvider,
        notification_settings_service_1.NotificationSettingsService,
        prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map