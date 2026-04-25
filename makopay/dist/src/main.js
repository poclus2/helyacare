"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
global.crypto = { randomUUID: crypto_1.randomUUID };
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:8080', 'http://localhost:3000',
            'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:8080',
            'https://makopay.live', 'https://www.makopay.live', 'https://admin.makopay.live'
        ],
        credentials: true,
    });
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map