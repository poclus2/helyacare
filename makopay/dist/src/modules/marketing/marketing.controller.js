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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketingController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../../core/guards/roles/roles.guard");
const roles_decorator_1 = require("../../core/decorators/roles/roles.decorator");
const client_1 = require("@prisma/client");
const marketing_service_1 = require("./marketing.service");
const create_campaign_dto_1 = require("./dto/create-campaign.dto");
const template_dto_1 = require("./dto/template.dto");
let MarketingController = class MarketingController {
    marketingService;
    constructor(marketingService) {
        this.marketingService = marketingService;
    }
    async createCampaign(dto, req) {
        return this.marketingService.createCampaign(dto, req.user.userId);
    }
    async getCampaigns(type, status, skip, take) {
        return this.marketingService.getCampaigns({ type, status }, {
            skip: skip ? parseInt(skip) : 0,
            take: take ? parseInt(take) : 20,
        });
    }
    async getCampaign(id) {
        return this.marketingService.getCampaign(id);
    }
    async deleteCampaign(id) {
        await this.marketingService.deleteCampaign(id);
        return { message: 'Campaign deleted successfully' };
    }
    async sendCampaign(id) {
        await this.marketingService.sendCampaign(id);
        return { message: 'Campaign queued for sending' };
    }
    async sendTestCampaign(id, body) {
        await this.marketingService.sendTestCampaign(id, body.recipient);
        return { message: 'Test message sent' };
    }
    async getCampaignStats(id) {
        return this.marketingService.getCampaignStats(id);
    }
    async previewTargetedUsers(filters) {
        return this.marketingService.previewTargetedUsers(filters);
    }
    async countTargetedUsers(filters) {
        const count = await this.marketingService.countTargetedUsers(filters);
        return { count };
    }
    async createTemplate(dto, req) {
        return this.marketingService.createTemplate(dto, req.user.userId);
    }
    async getTemplates(type) {
        return this.marketingService.getTemplates(type);
    }
    async updateTemplate(id, dto) {
        return this.marketingService.updateTemplate(id, dto);
    }
    async deleteTemplate(id) {
        await this.marketingService.deleteTemplate(id);
        return { message: 'Template deleted successfully' };
    }
};
exports.MarketingController = MarketingController;
__decorate([
    (0, common_1.Post)('campaigns'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_campaign_dto_1.CreateCampaignDto, Object]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "createCampaign", null);
__decorate([
    (0, common_1.Get)('campaigns'),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('skip')),
    __param(3, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof client_1.CampaignType !== "undefined" && client_1.CampaignType) === "function" ? _a : Object, String, String, String]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "getCampaigns", null);
__decorate([
    (0, common_1.Get)('campaigns/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "getCampaign", null);
__decorate([
    (0, common_1.Delete)('campaigns/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "deleteCampaign", null);
__decorate([
    (0, common_1.Post)('campaigns/:id/send'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "sendCampaign", null);
__decorate([
    (0, common_1.Post)('campaigns/:id/test'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "sendTestCampaign", null);
__decorate([
    (0, common_1.Get)('campaigns/:id/stats'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "getCampaignStats", null);
__decorate([
    (0, common_1.Post)('users/preview'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_campaign_dto_1.FilterUsersDto]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "previewTargetedUsers", null);
__decorate([
    (0, common_1.Post)('users/count'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_campaign_dto_1.FilterUsersDto]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "countTargetedUsers", null);
__decorate([
    (0, common_1.Post)('templates'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [template_dto_1.CreateTemplateDto, Object]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Get)('templates'),
    __param(0, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof client_1.CampaignType !== "undefined" && client_1.CampaignType) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "getTemplates", null);
__decorate([
    (0, common_1.Patch)('templates/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, template_dto_1.UpdateTemplateDto]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Delete)('templates/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "deleteTemplate", null);
exports.MarketingController = MarketingController = __decorate([
    (0, common_1.Controller)('marketing'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    __metadata("design:paramtypes", [marketing_service_1.MarketingService])
], MarketingController);
//# sourceMappingURL=marketing.controller.js.map