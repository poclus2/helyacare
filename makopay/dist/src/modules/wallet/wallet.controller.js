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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const common_1 = require("@nestjs/common");
const wallet_service_1 = require("./wallet.service");
const passport_1 = require("@nestjs/passport");
const client_1 = require("@prisma/client");
const payment_operation_decorator_1 = require("../../core/decorators/payment-operation.decorator");
const auth_service_1 = require("../auth/auth.service");
let WalletController = class WalletController {
    walletService;
    authService;
    constructor(walletService, authService) {
        this.walletService = walletService;
        this.authService = authService;
    }
    async getWallet(req) {
        return this.walletService.getWallet(req.user.userId);
    }
    async withdrawOtp(req) {
        return this.authService.generateWithdrawalOtp(req.user.userId);
    }
    async withdraw(req, body) {
        if (!body.amount || body.amount <= 0) {
            throw new common_1.BadRequestException('Invalid amount');
        }
        if (!body.otp) {
            throw new common_1.BadRequestException('Verification code required');
        }
        const isValid = await this.authService.validateOtp(req.user.userId, body.otp);
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid verification code');
        }
        const amount = new client_1.Prisma.Decimal(body.amount);
        return this.walletService.requestWithdrawal(req.user.userId, amount, body.method || 'UNKNOWN', body.details || `REQ-${Date.now()}`);
    }
    async deposit(req, body) {
        if (!body.amount || body.amount <= 0 || !body.method) {
            throw new common_1.BadRequestException('Invalid amount or method');
        }
        const amount = new client_1.Prisma.Decimal(body.amount);
        return this.walletService.createDepositRequest(req.user.userId, amount, body.method, body.payerPhoneNumber, body.currency);
    }
};
exports.WalletController = WalletController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getWallet", null);
__decorate([
    (0, common_1.Post)('withdraw/otp'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "withdrawOtp", null);
__decorate([
    (0, common_1.Post)('withdraw'),
    (0, payment_operation_decorator_1.PaymentOperation)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "withdraw", null);
__decorate([
    (0, common_1.Post)('deposit'),
    (0, payment_operation_decorator_1.PaymentOperation)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "deposit", null);
exports.WalletController = WalletController = __decorate([
    (0, common_1.Controller)('wallet'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [wallet_service_1.WalletService,
        auth_service_1.AuthService])
], WalletController);
//# sourceMappingURL=wallet.controller.js.map