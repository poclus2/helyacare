"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketingModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const axios_1 = require("@nestjs/axios");
const marketing_controller_1 = require("./marketing.controller");
const marketing_service_1 = require("./marketing.service");
const database_module_1 = require("../../core/database/database.module");
const notifications_module_1 = require("../notifications/notifications.module");
const campaign_processor_1 = require("./queues/campaign.processor");
const sms_processor_1 = require("./queues/sms.processor");
const email_processor_1 = require("./queues/email.processor");
const nexah_service_1 = require("./providers/nexah.service");
const resend_service_1 = require("./providers/resend.service");
let MarketingModule = class MarketingModule {
};
exports.MarketingModule = MarketingModule;
exports.MarketingModule = MarketingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            notifications_module_1.NotificationsModule,
            axios_1.HttpModule,
            bullmq_1.BullModule.registerQueue({ name: 'campaign' }, { name: 'sms' }, { name: 'email' }),
        ],
        controllers: [marketing_controller_1.MarketingController],
        providers: [
            marketing_service_1.MarketingService,
            campaign_processor_1.CampaignProcessor,
            sms_processor_1.SmsProcessor,
            email_processor_1.EmailProcessor,
            nexah_service_1.NexahService,
            resend_service_1.ResendService,
        ],
        exports: [marketing_service_1.MarketingService],
    })
], MarketingModule);
//# sourceMappingURL=marketing.module.js.map