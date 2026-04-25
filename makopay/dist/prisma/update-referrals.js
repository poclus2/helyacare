"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const users = await prisma.user.findMany({
        where: { referralCode: null },
    });
    console.log(`Found ${users.length} users ensuring referral codes...`);
    for (const user of users) {
        let code = generateReferralCode();
        let unique = false;
        let attempts = 0;
        while (!unique && attempts < 5) {
            const existing = await prisma.user.findUnique({ where: { referralCode: code } });
            if (!existing) {
                unique = true;
            }
            else {
                code = generateReferralCode();
                attempts++;
            }
        }
        if (unique) {
            await prisma.user.update({
                where: { id: user.id },
                data: { referralCode: code },
            });
            console.log(`Updated user ${user.email || user.phoneNumber} with code ${code}`);
        }
        else {
            console.error(`Failed to generate unique code for user ${user.id}`);
        }
    }
}
function generateReferralCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
//# sourceMappingURL=update-referrals.js.map