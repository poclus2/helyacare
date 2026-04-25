export declare class EmailProvider {
    private resend;
    private readonly logger;
    constructor();
    sendEmail(to: string, subject: string, html: string): Promise<any>;
}
