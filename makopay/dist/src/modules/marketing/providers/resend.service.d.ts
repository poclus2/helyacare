export declare class ResendService {
    private readonly logger;
    private readonly resend;
    private readonly fromEmail;
    private readonly fromName;
    constructor();
    sendEmail(to: string, subject: string, message: string): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    private formatHtml;
    calculateCost(emailCount: number): number;
}
