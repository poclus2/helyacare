import { HttpService } from '@nestjs/axios';
export declare class NexahService {
    private readonly httpService;
    private readonly logger;
    private readonly apiUrl;
    private readonly apiKey;
    private readonly senderId;
    constructor(httpService: HttpService);
    sendSms(to: string, message: string): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    getBalance(): Promise<number>;
    calculateCost(messageCount: number): number;
}
