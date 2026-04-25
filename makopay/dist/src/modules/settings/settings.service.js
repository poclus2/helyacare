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
var SettingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma/prisma.service");
let SettingsService = SettingsService_1 = class SettingsService {
    prisma;
    logger = new common_1.Logger(SettingsService_1.name);
    DEFAULT_FEES = {
        FEE_DEPOSIT_PERCENT: '0',
        FEE_WITHDRAWAL_PERCENT: '1.5',
        FEE_ORDER_PERCENT: '0'
    };
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        await this.seedDefaults();
    }
    async seedDefaults() {
        for (const [key, value] of Object.entries(this.DEFAULT_FEES)) {
            const exists = await this.prisma.systemSetting.findUnique({ where: { key } });
            if (!exists) {
                await this.prisma.systemSetting.create({
                    data: { key, value, description: `System Fee: ${key}` }
                });
                this.logger.log(`Seeded default setting: ${key} = ${value}`);
            }
        }
    }
    async getSetting(key, defaultValue = '0') {
        const setting = await this.prisma.systemSetting.findUnique({ where: { key } });
        return setting ? setting.value : defaultValue;
    }
    async getFees() {
        const depositFee = await this.getSetting('FEE_DEPOSIT_PERCENT', this.DEFAULT_FEES.FEE_DEPOSIT_PERCENT);
        const withdrawalFee = await this.getSetting('FEE_WITHDRAWAL_PERCENT', this.DEFAULT_FEES.FEE_WITHDRAWAL_PERCENT);
        const orderFee = await this.getSetting('FEE_ORDER_PERCENT', this.DEFAULT_FEES.FEE_ORDER_PERCENT);
        return {
            depositFeePercent: Number(depositFee),
            withdrawalFeePercent: Number(withdrawalFee),
            orderFeePercent: Number(orderFee)
        };
    }
    async updateFees(dto) {
        await this.prisma.$transaction([
            this.prisma.systemSetting.upsert({
                where: { key: 'FEE_DEPOSIT_PERCENT' },
                update: { value: dto.depositFeePercent.toString() },
                create: { key: 'FEE_DEPOSIT_PERCENT', value: dto.depositFeePercent.toString(), description: 'Deposit Fee %' }
            }),
            this.prisma.systemSetting.upsert({
                where: { key: 'FEE_WITHDRAWAL_PERCENT' },
                update: { value: dto.withdrawalFeePercent.toString() },
                create: { key: 'FEE_WITHDRAWAL_PERCENT', value: dto.withdrawalFeePercent.toString(), description: 'Withdrawal Fee %' }
            }),
            this.prisma.systemSetting.upsert({
                where: { key: 'FEE_ORDER_PERCENT' },
                update: { value: dto.orderFeePercent.toString() },
                create: { key: 'FEE_ORDER_PERCENT', value: dto.orderFeePercent.toString(), description: 'Order Fee %' }
            })
        ]);
        return this.getFees();
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = SettingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map