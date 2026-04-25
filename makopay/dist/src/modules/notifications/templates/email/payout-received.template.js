"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutReceivedTemplate = void 0;
const base_template_1 = require("./base.template");
const PayoutReceivedTemplate = (name, amount, currency, source) => {
    const content = `
        <p>Hello ${name},</p>
        <p>You've received a new payout!</p>
        
        <div class="card">
            <div class="card-row">
                <span class="label">Amount:</span>
                <span class="value highlight">+${amount} ${currency}</span>
            </div>
            <div class="card-row">
                <span class="label">Source:</span>
                <span class="value">${source}</span>
            </div>
        </div>

        <p>The funds have been added to your wallet balance.</p>
        <a href="${process.env.FRONTEND_URL}/dashboard/wallet" class="button">View Wallet</a>
    `;
    return (0, base_template_1.BaseEmailTemplate)('Payout Received', content);
};
exports.PayoutReceivedTemplate = PayoutReceivedTemplate;
//# sourceMappingURL=payout-received.template.js.map