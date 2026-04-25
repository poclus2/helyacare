"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderPaidTemplate = void 0;
const base_template_1 = require("./base.template");
const OrderPaidTemplate = (name, orderId, amount, currency, itemCount) => {
    const content = `
        <p>Hello ${name},</p>
        <p>Thank you for your purchase! Your order has been confirmed.</p>
        
        <div class="card">
            <div class="card-row">
                <span class="label">Order ID:</span>
                <span class="value">${orderId}</span>
            </div>
            <div class="card-row">
                <span class="label">Total Amount:</span>
                <span class="value highlight">${amount} ${currency}</span>
            </div>
            <div class="card-row">
                <span class="label">Items:</span>
                <span class="value">${itemCount}</span>
            </div>
        </div>

        <p>We are processing your order and will notify you when it ships.</p>
        <a href="${process.env.FRONTEND_URL}/dashboard/history" class="button">View Order</a>
    `;
    return (0, base_template_1.BaseEmailTemplate)('Order Confirmed', content);
};
exports.OrderPaidTemplate = OrderPaidTemplate;
//# sourceMappingURL=order-paid.template.js.map