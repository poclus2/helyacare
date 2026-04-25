import { PrismaService } from '../database/prisma/prisma.service';
import { MlmService } from '../../modules/mlm/mlm.service';
export declare class OutboxService {
    private prisma;
    private mlmService;
    private readonly logger;
    private isProcessing;
    constructor(prisma: PrismaService, mlmService: MlmService);
    processOutbox(): Promise<void>;
    private processEvent;
    private handleOrderPaid;
}
