"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentOperation = exports.PAYMENT_OPERATION_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.PAYMENT_OPERATION_KEY = 'payment_operation';
const PaymentOperation = () => (0, common_1.SetMetadata)(exports.PAYMENT_OPERATION_KEY, true);
exports.PaymentOperation = PaymentOperation;
//# sourceMappingURL=payment-operation.decorator.js.map