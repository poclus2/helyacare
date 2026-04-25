import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { UpdateFeesDto } from './dto/update-fees.dto';
export declare class SettingsService implements OnModuleInit {
    private prisma;
    private readonly logger;
    private readonly DEFAULT_FEES;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    private seedDefaults;
    getSetting(key: string, defaultValue?: string): Promise<string>;
    getFees(): Promise<{
        depositFeePercent: number;
        withdrawalFeePercent: number;
        orderFeePercent: number;
    }>;
    updateFees(dto: UpdateFeesDto): Promise<{
        depositFeePercent: number;
        withdrawalFeePercent: number;
        orderFeePercent: number;
    }>;
}
