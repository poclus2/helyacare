"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewReferralTemplate = void 0;
const base_template_1 = require("./base.template");
const NewReferralTemplate = (sponsorName, referralName) => {
    const content = `
        <p>Hello ${sponsorName},</p>
        <p>Great news! Your network is growing.</p>
        
        <div class="card">
            <div class="card-row">
                <span class="label">New Member:</span>
                <span class="value highlight">${referralName}</span>
            </div>
            <div class="card-row">
                <span class="label">Date Joined:</span>
                <span class="value">${new Date().toLocaleDateString()}</span>
            </div>
        </div>

        <p>Help them verify their account and make their first investment to earn commissions.</p>
        <a href="${process.env.FRONTEND_URL}/dashboard/network" class="button">View Network</a>
    `;
    return (0, base_template_1.BaseEmailTemplate)('New Team Member', content);
};
exports.NewReferralTemplate = NewReferralTemplate;
//# sourceMappingURL=new-referral.template.js.map