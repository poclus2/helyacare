import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../../core/database/prisma/prisma.service';
import { NexahService } from '../providers/nexah.service';
export declare class SmsProcessor extends WorkerHost {
    private prisma;
    private nexahService;
    private readonly logger;
    constructor(prisma: PrismaService, nexahService: NexahService);
    process(job: Job): Promise<any>;
    private handleSmsSend;
}
