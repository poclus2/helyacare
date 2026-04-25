"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositReceivedTemplate = void 0;
const base_template_1 = require("./base.template");
const DepositReceivedTemplate = (name, amount, currency, method) => {
    const content = `
        <p>Hello ${name},</p>
        <p>Good news! Your deposit has been successfully credited to your wallet.</p>
        
        <div class="card">
            <div class="card-row">
                <span class="label">Amount:</span>
                <span class="value highlight">+${amount} ${currency}</span>
            </div>
            <div class="card-row">
                <span class="label">Method:</span>
                <span class="value">${method}</span>
            </div>
            <div class="card-row">
                <span class="label">Date:</span>
                <span class="value">${new Date().toLocaleDateString()}</span>
            </div>
        </div>

        <p>You can now use these funds to invest in our products or purchase items from the shop.</p>
        <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
    `;
    return (0, base_template_1.BaseEmailTemplate)('Deposit Confirmed', content);
};
exports.DepositReceivedTemplate = DepositReceivedTemplate;
//# sourceMappingURL=deposit-received.template.js.map