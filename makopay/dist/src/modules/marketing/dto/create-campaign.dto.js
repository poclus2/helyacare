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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCampaignDto = exports.FilterUsersDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class FilterUsersDto {
    kycStatus;
    registeredAfter;
    registeredBefore;
    balanceMin;
    balanceMax;
    hasInvestments;
    hasReferrals;
    phonePrefix;
}
exports.FilterUsersDto = FilterUsersDto;
__decorate([
    (0, class_validator_1.IsEnum)(['PENDING', 'VERIFIED', 'REJECTED']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterUsersDto.prototype, "kycStatus", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], FilterUsersDto.prototype, "registeredAfter", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], FilterUsersDto.prototype, "registeredBefore", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FilterUsersDto.prototype, "balanceMin", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FilterUsersDto.prototype, "balanceMax", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FilterUsersDto.prototype, "hasInvestments", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FilterUsersDto.prototype, "hasReferrals", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterUsersDto.prototype, "phonePrefix", void 0);
class CreateCampaignDto {
    name;
    type;
    subject;
    message;
    templateId;
    targetType;
    filters;
    customListUrl;
    sendNow = true;
    scheduledAt;
}
exports.CreateCampaignDto = CreateCampaignDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.CampaignType),
    __metadata("design:type", typeof (_a = typeof client_1.CampaignType !== "undefined" && client_1.CampaignType) === "function" ? _a : Object)
], CreateCampaignDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "templateId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.TargetType),
    __metadata("design:type", typeof (_b = typeof client_1.TargetType !== "undefined" && client_1.TargetType) === "function" ? _b : Object)
], CreateCampaignDto.prototype, "targetType", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", FilterUsersDto)
], CreateCampaignDto.prototype, "filters", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "customListUrl", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCampaignDto.prototype, "sendNow", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateCampaignDto.prototype, "scheduledAt", void 0);
//# sourceMappingURL=create-campaign.dto.js.map