"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NEXAH_SENDER_IDS = exports.CameroonOperator = void 0;
exports.normalizePhoneNumber = normalizePhoneNumber;
exports.detectCameroonOperator = detectCameroonOperator;
exports.isCameroonNumber = isCameroonNumber;
exports.getNexahSenderId = getNexahSenderId;
var CameroonOperator;
(function (CameroonOperator) {
    CameroonOperator["ORANGE"] = "ORANGE";
    CameroonOperator["MTN"] = "MTN";
    CameroonOperator["UNKNOWN"] = "UNKNOWN";
})(CameroonOperator || (exports.CameroonOperator = CameroonOperator = {}));
const OPERATOR_PREFIXES = {
    ORANGE: [
        '640', '655', '656', '657', '658', '659',
        '686', '687', '688', '689', '69'
    ],
    MTN: [
        '650', '651', '652', '653', '654',
        '67', '680', '681', '682', '683'
    ]
};
function normalizePhoneNumber(phoneNumber) {
    let normalized = phoneNumber.replace(/[\s\-\(\)]/g, '');
    if (normalized.startsWith('+237')) {
        normalized = normalized.substring(4);
    }
    else if (normalized.startsWith('237')) {
        normalized = normalized.substring(3);
    }
    if (normalized.startsWith('0')) {
        normalized = normalized.substring(1);
    }
    return normalized;
}
function detectCameroonOperator(phoneNumber) {
    const normalized = normalizePhoneNumber(phoneNumber);
    if (normalized.length !== 9) {
        return CameroonOperator.UNKNOWN;
    }
    for (const prefix of OPERATOR_PREFIXES.ORANGE) {
        if (normalized.startsWith(prefix)) {
            return CameroonOperator.ORANGE;
        }
    }
    for (const prefix of OPERATOR_PREFIXES.MTN) {
        if (normalized.startsWith(prefix)) {
            return CameroonOperator.MTN;
        }
    }
    return CameroonOperator.UNKNOWN;
}
function isCameroonNumber(phoneNumber) {
    const normalized = normalizePhoneNumber(phoneNumber);
    const hasCameroonPrefix = phoneNumber.includes('237');
    const operator = detectCameroonOperator(phoneNumber);
    return hasCameroonPrefix || operator !== CameroonOperator.UNKNOWN;
}
exports.NEXAH_SENDER_IDS = {
    [CameroonOperator.ORANGE]: 'Makopay',
    [CameroonOperator.MTN]: 'InfoSMS',
    [CameroonOperator.UNKNOWN]: 'InfoSMS',
};
function getNexahSenderId(phoneNumber) {
    const operator = detectCameroonOperator(phoneNumber);
    return exports.NEXAH_SENDER_IDS[operator];
}
//# sourceMappingURL=cameroon-operator.util.js.map