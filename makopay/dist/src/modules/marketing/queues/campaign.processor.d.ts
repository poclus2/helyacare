import { WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { PrismaService } from '../../../core/database/prisma/prisma.service';
export declare class CampaignProcessor extends WorkerHost {
    private prisma;
    private smsQueue;
    private emailQueue;
    private readonly logger;
    constructor(prisma: PrismaService, smsQueue: Queue, emailQueue: Queue);
    process(job: Job<any, any, string>): Promise<any>;
    private handleCampaignSend;
    private handleCampaignCompletion;
}
