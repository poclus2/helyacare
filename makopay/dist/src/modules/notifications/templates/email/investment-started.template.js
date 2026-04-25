"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentStartedTemplate = void 0;
const base_template_1 = require("./base.template");
const InvestmentStartedTemplate = (name, planName, amount, currency, endDate) => {
    const content = `
        <p>Hello ${name},</p>
        <p>Congratulations! Your new investment plan has started successfully.</p>
        
        <div class="card">
            <div class="card-row">
                <span class="label">Plan:</span>
                <span class="value highlight">${planName}</span>
            </div>
            <div class="card-row">
                <span class="label">Invested Amount:</span>
                <span class="value">${amount} ${currency}</span>
            </div>
             <div class="card-row">
                <span class="label">Completion Date:</span>
                <span class="value">${endDate}</span>
            </div>
        </div>

        <p>You can track your investment performance directly from your dashboard.</p>
        <a href="${process.env.FRONTEND_URL}/dashboard/investments" class="button">Track Investment</a>
    `;
    return (0, base_template_1.BaseEmailTemplate)('Investment Started', content);
};
exports.InvestmentStartedTemplate = InvestmentStartedTemplate;
//# sourceMappingURL=investment-started.template.js.map