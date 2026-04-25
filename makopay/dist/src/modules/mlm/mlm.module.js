"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MlmModule = void 0;
const common_1 = require("@nestjs/common");
const mlm_controller_1 = require("./mlm.controller");
const mlm_service_1 = require("./mlm.service");
const database_module_1 = require("../../core/database/database.module");
const wallet_module_1 = require("../wallet/wallet.module");
const bullmq_1 = require("@nestjs/bullmq");
const mlm_processor_1 = require("./processors/mlm.processor");
let MlmModule = class MlmModule {
};
exports.MlmModule = MlmModule;
exports.MlmModule = MlmModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            wallet_module_1.WalletModule,
            bullmq_1.BullModule.registerQueue({
                name: 'mlm',
            }),
        ],
        controllers: [mlm_controller_1.MlmController],
        providers: [mlm_service_1.MlmService, mlm_processor_1.MlmProcessor],
        exports: [mlm_service_1.MlmService],
    })
], MlmModule);
//# sourceMappingURL=mlm.module.js.map