import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../../core/database/prisma/prisma.service';
import { ResendService } from '../providers/resend.service';
export declare class EmailProcessor extends WorkerHost {
    private prisma;
    private resendService;
    private readonly logger;
    constructor(prisma: PrismaService, resendService: ResendService);
    process(job: Job): Promise<any>;
    private handleEmailSend;
}
