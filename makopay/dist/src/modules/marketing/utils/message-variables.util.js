"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceVariables = replaceVariables;
function replaceVariables(template, user) {
    if (!user)
        return template;
    let message = template;
    const variables = {
        '{firstName}': user.firstName || '',
        '{lastName}': user.lastName || '',
        '{phone}': user.phoneNumber || '',
        '{email}': user.email || '',
        '{balance}': user.wallet?.balance?.toLocaleString('fr-FR') || '0',
        '{kycStatus}': user.kycStatus || 'PENDING',
        '{referralCode}': user.referralCode || '',
    };
    Object.entries(variables).forEach(([key, value]) => {
        message = message.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), String(value));
    });
    return message;
}
//# sourceMappingURL=message-variables.util.js.map