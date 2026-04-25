"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomeSmsTemplate = exports.OtpSmsTemplate = void 0;
const OtpSmsTemplate = (code) => `Your MakoPay verification code is: ${code}. Do not share this code with anyone. Valid for 10 minutes.`;
exports.OtpSmsTemplate = OtpSmsTemplate;
const WelcomeSmsTemplate = (name) => `Welcome to MakoPay, ${name}! We're glad to have you with us. Log in now to start your journey.`;
exports.WelcomeSmsTemplate = WelcomeSmsTemplate;
//# sourceMappingURL=otp.template.js.map