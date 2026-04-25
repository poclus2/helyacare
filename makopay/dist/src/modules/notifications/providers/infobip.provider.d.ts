export declare class InfobipProvider {
    private infobip;
    private readonly logger;
    constructor();
    sendSms(to: string, message: string): Promise<any>;
    sendWhatsApp(to: string, message: string): Promise<any>;
}
