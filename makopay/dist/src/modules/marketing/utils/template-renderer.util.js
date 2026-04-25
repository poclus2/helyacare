"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTemplate = renderTemplate;
exports.extractVariables = extractVariables;
exports.getSystemVariables = getSystemVariables;
exports.renderUserTemplate = renderUserTemplate;
function renderTemplate(template, variables) {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`\\{${key}\\}`, 'g');
        result = result.replace(regex, String(value || ''));
    }
    return result;
}
function extractVariables(template) {
    const regex = /\{([a-zA-Z0-9_]+)\}/g;
    const matches = template.matchAll(regex);
    const variables = Array.from(matches).map(match => match[1]);
    return Array.from(new Set(variables));
}
function getSystemVariables(user) {
    const currentDate = new Date();
    return {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        phoneNumber: user.phoneNumber || '',
        email: user.email || '',
        balance: user.wallet?.balance || 0,
        balanceXAF: Math.floor(user.wallet?.balance || 0),
        referralCode: user.referralCode || '',
        referralLink: user.referralCode ? `https://makopay.live/auth/register?ref=${user.referralCode}` : '',
        appName: 'MakoPay',
        supportEmail: 'support@makopay.live',
        websiteUrl: 'https://makopay.live',
        currentDate: currentDate.toLocaleDateString('fr-FR'),
        currentYear: currentDate.getFullYear(),
    };
}
function renderUserTemplate(template, user, customVariables) {
    const systemVars = getSystemVariables(user);
    const allVariables = { ...systemVars, ...customVariables };
    return renderTemplate(template, allVariables);
}
//# sourceMappingURL=template-renderer.util.js.map