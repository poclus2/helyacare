import { SettingsService } from './settings.service';
import { UpdateFeesDto } from './dto/update-fees.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
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
