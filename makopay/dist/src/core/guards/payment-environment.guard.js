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
var PaymentEnvironmentGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentEnvironmentGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const payment_operation_decorator_1 = require("../decorators/payment-operation.decorator");
let PaymentEnvironmentGuard = PaymentEnvironmentGuard_1 = class PaymentEnvironmentGuard {
    reflector;
    configService;
    logger = new common_1.Logger(PaymentEnvironmentGuard_1.name);
    constructor(reflector, configService) {
        this.reflector = reflector;
        this.configService = configService;
    }
    canActivate(context) {
        const isPaymentOperation = this.reflector.getAllAndOverride(payment_operation_decorator_1.PAYMENT_OPERATION_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!isPaymentOperation) {
            return true;
        }
        const paymentMode = this.configService.get('PAYMENT_MODE', 'SANDBOX');
        const request = context.switchToHttp().getRequest();
        if (paymentMode === 'SANDBOX') {
            this.logger.log(`Executing Payment Operation in SANDBOX mode: ${request.method} ${request.url}`);
        }
        else if (paymentMode === 'PRODUCTION') {
            const protocol = request.protocol;
            if (protocol !== 'https' && !request.headers['x-forwarded-proto']?.includes('https')) {
                this.logger.warn(`Payment Operation in PRODUCTION via HTTP! (Not HTTPS)`);
            }
        }
        return true;
    }
};
exports.PaymentEnvironmentGuard = PaymentEnvironmentGuard;
exports.PaymentEnvironmentGuard = PaymentEnvironmentGuard = PaymentEnvironmentGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        config_1.ConfigService])
], PaymentEnvironmentGuard);
//# sourceMappingURL=payment-environment.guard.js.map