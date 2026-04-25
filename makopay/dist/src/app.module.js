"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./modules/users/users.module");
const auth_module_1 = require("./modules/auth/auth.module");
const database_module_1 = require("./core/database/database.module");
const products_module_1 = require("./modules/products/products.module");
const orders_module_1 = require("./modules/orders/orders.module");
const investments_module_1 = require("./modules/investments/investments.module");
const mlm_module_1 = require("./modules/mlm/mlm.module");
const wallet_module_1 = require("./modules/wallet/wallet.module");
const bullmq_1 = require("@nestjs/bullmq");
const outbox_module_1 = require("./core/outbox/outbox.module");
const admin_module_1 = require("./modules/admin/admin.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const support_module_1 = require("./modules/support/support.module");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const payment_environment_guard_1 = require("./core/guards/payment-environment.guard");
const settings_module_1 = require("./modules/settings/settings.module");
const marketing_module_1 = require("./modules/marketing/marketing.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            schedule_1.ScheduleModule.forRoot(),
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    connection: {
                        host: configService.get('REDIS_HOST'),
                        port: configService.get('REDIS_PORT'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            database_module_1.DatabaseModule,
            outbox_module_1.OutboxModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
            investments_module_1.InvestmentsModule,
            mlm_module_1.MlmModule,
            wallet_module_1.WalletModule,
            admin_module_1.AdminModule,
            notifications_module_1.NotificationsModule,
            support_module_1.SupportModule,
            settings_module_1.SettingsModule,
            marketing_module_1.MarketingModule,
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                serveRoot: '/uploads',
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: 'APP_GUARD',
                useClass: payment_environment_guard_1.PaymentEnvironmentGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map