"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./src/app.module");
const users_service_1 = require("./src/modules/users/users.service");
const auth_service_1 = require("./src/modules/auth/auth.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const usersService = app.get(users_service_1.UsersService);
    const authService = app.get(auth_service_1.AuthService);
    console.log('--- DEBUG START ---');
    const admin = await usersService.findOne('+15550000000');
    console.log('Admin found:', admin ? 'YES' : 'NO');
    if (admin) {
        console.log('Admin ID:', admin.id);
        console.log('Admin Hash:', admin.passwordHash);
        const valid = await authService.validateUser('+15550000000', 'admin123');
        console.log('Password Valid:', valid ? 'YES' : 'NO');
        if (valid) {
            const login = await authService.login(admin);
            console.log('Token generated:', !!login.access_token);
            const userById = await usersService.findById(admin.id);
            console.log('Find By ID works:', !!userById);
        }
    }
    console.log('--- DEBUG END ---');
    await app.close();
}
bootstrap();
//# sourceMappingURL=debug_auth.js.map