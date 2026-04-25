import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MlmService } from '../mlm.service';
export declare class MlmProcessor extends WorkerHost {
    private readonly mlmService;
    private readonly logger;
    constructor(mlmService: MlmService);
    process(job: Job<any, any, string>): Promise<any>;
}
