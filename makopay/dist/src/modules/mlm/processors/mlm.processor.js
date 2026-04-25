"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MlmProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MlmProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const mlm_service_1 = require("../mlm.service");
let MlmProcessor = MlmProcessor_1 = class MlmProcessor extends bullmq_1.WorkerHost {
    mlmService;
    logger = new common_1.Logger(MlmProcessor_1.name);
    constructor(mlmService) {
        super();
        this.mlmService = mlmService;
    }
    async process(job) {
        switch (job.name) {
            case 'distribute_commission':
                this.logger.log(`Processing commission distribution for order ${job.data.orderId}`);
                await this.mlmService.handleCommissionDistributionJob(job.data.orderId, job.data.userId, job.data.amount);
                break;
            default:
                this.logger.warn(`Unknown job name: ${job.name}`);
        }
    }
};
exports.MlmProcessor = MlmProcessor;
exports.MlmProcessor = MlmProcessor = MlmProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('mlm'),
    __metadata("design:paramtypes", [mlm_service_1.MlmService])
], MlmProcessor);
//# sourceMappingURL=mlm.processor.js.map