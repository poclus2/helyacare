"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const argon2 = __importStar(require("argon2"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Start seeding ...');
    const adminPhone = '+15550000000';
    const existingAdmin = await prisma.user.findUnique({ where: { phoneNumber: adminPhone } });
    if (!existingAdmin) {
        const passwordHash = await argon2.hash('admin123');
        await prisma.user.create({
            data: {
                phoneNumber: adminPhone,
                email: 'admin@makopay.com',
                firstName: 'Super',
                lastName: 'Admin',
                passwordHash,
                role: client_1.UserRole.ADMIN,
            },
        });
        console.log('Created Admin');
    }
    const plans = [
        {
            name: 'Starter Plan',
            durationDays: 30,
            yieldPercent: 10.00,
            minAmount: 100,
            payoutFrequency: client_1.PayoutFrequency.DAILY
        },
        {
            name: 'Pro Plan',
            durationDays: 60,
            yieldPercent: 15.00,
            minAmount: 500,
            payoutFrequency: client_1.PayoutFrequency.DAILY
        },
        {
            name: 'Whale Plan',
            durationDays: 90,
            yieldPercent: 25.00,
            minAmount: 2000,
            payoutFrequency: client_1.PayoutFrequency.DAILY
        }
    ];
    for (const p of plans) {
        const existing = await prisma.investmentPlan.findFirst({ where: { name: p.name } });
        if (!existing) {
            await prisma.investmentPlan.create({
                data: {
                    ...p,
                    yieldPercent: new Number(p.yieldPercent).toString(),
                    minAmount: new Number(p.minAmount).toString()
                }
            });
            console.log(`Created Plan: ${p.name}`);
        }
    }
    const passwordHash = await argon2.hash('user123');
    let userA = await prisma.user.findUnique({ where: { phoneNumber: '+15550000001' } });
    if (!userA) {
        userA = await prisma.user.create({
            data: {
                phoneNumber: '+15550000001',
                email: 'userA@example.com',
                firstName: 'Alice',
                lastName: 'Wonder',
                passwordHash,
                role: client_1.UserRole.USER
            }
        });
        console.log('Created User A');
    }
    let userB = await prisma.user.findUnique({ where: { phoneNumber: '+15550000002' } });
    if (!userB) {
        userB = await prisma.user.create({
            data: {
                phoneNumber: '+15550000002',
                email: 'userB@example.com',
                firstName: 'Bob',
                lastName: 'Builder',
                passwordHash,
                role: client_1.UserRole.USER,
                sponsorId: userA.id
            }
        });
        console.log('Created User B');
    }
    let userC = await prisma.user.findUnique({ where: { phoneNumber: '+15550000003' } });
    if (!userC) {
        userC = await prisma.user.create({
            data: {
                phoneNumber: '+15550000003',
                email: 'userC@example.com',
                firstName: 'Charlie',
                lastName: 'Chain',
                passwordHash,
                role: client_1.UserRole.USER,
                sponsorId: userB.id
            }
        });
        console.log('Created User C');
    }
    const starterPlan = await prisma.investmentPlan.findFirst({ where: { name: 'Starter Plan' } });
    if (starterPlan) {
        const prodName = 'Mining Rig Starter';
        const existingProd = await prisma.product.findFirst({ where: { name: prodName } });
        if (!existingProd) {
            await prisma.product.create({
                data: {
                    name: prodName,
                    sku: 'RIG-001',
                    price: 150.00,
                    stock: 100,
                    isCommissionable: true,
                    investmentPlanId: starterPlan.id
                }
            });
            console.log('Created Product: Mining Rig Starter');
        }
    }
    console.log('Seeding finished.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map