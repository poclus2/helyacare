"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cameroon_operator_util_1 = require("../src/modules/notifications/utils/cameroon-operator.util");
const NEXAH_CONFIG = {
    baseUrl: 'https://smsvas.com/bulk/public/index.php/api/v1',
    user: 'njoyaabdelazizthierry@gmail.com',
    password: 'Vykuj3546@',
};
const TEST_NUMBERS = [
    { number: '237655867729', expected: 'ORANGE' },
    { number: '237651702809', expected: 'MTN' },
    { number: '237696519986', expected: 'ORANGE' },
    { number: '237681233358', expected: 'MTN' },
];
async function testGetBalance() {
    console.log('\n📊 TEST 1: Récupération du solde NEXAH...');
    try {
        const response = await axios_1.default.post(`${NEXAH_CONFIG.baseUrl}/smscredit`, {
            user: NEXAH_CONFIG.user,
            password: NEXAH_CONFIG.password,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
        console.log('✅ Solde récupéré avec succès:');
        console.log(`   💰 Crédits disponibles: ${response.data.credit} SMS`);
        console.log(`   📅 Expiration compte: ${response.data.accountexpdate}`);
        console.log(`   📅 Expiration balance: ${response.data.balanceexpdate}`);
        if (response.data.credit < 10) {
            console.warn('⚠️  Attention: Solde faible (< 10 SMS)');
        }
    }
    catch (error) {
        console.error('❌ Erreur lors de la récupération du solde:');
        console.error('   ', error.response?.data || error.message);
        throw error;
    }
}
async function testSendSmsWithAutoDetection() {
    console.log('\n📨 TEST 2: Envoi de SMS avec détection automatique d\'opérateur...\n');
    const testMessage = `Test MakoPay NEXAH AUTO - ${new Date().toLocaleString('fr-FR')}`;
    let successCount = 0;
    let failureCount = 0;
    for (const test of TEST_NUMBERS) {
        console.log('─'.repeat(60));
        console.log(`📱 Numéro: ${test.number}`);
        const detectedOperator = (0, cameroon_operator_util_1.detectCameroonOperator)(test.number);
        const senderId = (0, cameroon_operator_util_1.getNexahSenderId)(test.number);
        console.log(`🔍 Opérateur détecté: ${detectedOperator}`);
        console.log(`📤 Sender ID sélectionné: ${senderId}`);
        console.log(`✓ Attendu: ${test.expected}`);
        if (detectedOperator !== test.expected) {
            console.warn(`⚠️  ATTENTION: Détection incorrecte! Attendu ${test.expected}, obtenu ${detectedOperator}`);
        }
        try {
            const response = await axios_1.default.post(`${NEXAH_CONFIG.baseUrl}/sendsms`, {
                user: NEXAH_CONFIG.user,
                password: NEXAH_CONFIG.password,
                senderid: senderId,
                sms: testMessage,
                mobiles: test.number,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                timeout: 10000,
            });
            if (response.data.responsecode === 1 && response.data.sms && response.data.sms.length > 0) {
                const smsResult = response.data.sms[0];
                if (smsResult.status === 'success') {
                    console.log(`✅ Envoi réussi`);
                    console.log(`   🆔 Message ID: ${smsResult.messageid}`);
                    console.log(`   🔖 Client ID: ${smsResult.smsclientid}`);
                    successCount++;
                }
                else {
                    console.log(`❌ Envoi échoué: ${smsResult.errorcode} - ${smsResult.errordescription}`);
                    failureCount++;
                }
            }
            else {
                console.log(`❌ Réponse API invalide: ${response.data.responsemessage}`);
                failureCount++;
            }
        }
        catch (error) {
            console.log(`❌ Erreur réseau: ${error.message}`);
            failureCount++;
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
    }
    console.log('\n' + '='.repeat(60));
    console.log(`📊 RÉSULTAT FINAL: ${successCount} succès, ${failureCount} échecs sur ${TEST_NUMBERS.length} envois`);
    console.log('='.repeat(60));
}
async function main() {
    console.log('🚀 NEXAH SMS API - Test de Détection Automatique\n');
    console.log('='.repeat(60));
    console.log(`📍 API: ${NEXAH_CONFIG.baseUrl}`);
    console.log(`👤 User: ${NEXAH_CONFIG.user}`);
    console.log(`🧪 Numéros à tester: ${TEST_NUMBERS.length}`);
    console.log('='.repeat(60));
    try {
        await testGetBalance();
        await new Promise(resolve => setTimeout(resolve, 2000));
        await testSendSmsWithAutoDetection();
        console.log('\n✅ Tous les tests sont terminés avec succès !\n');
    }
    catch (error) {
        console.log('\n❌ Les tests ont échoué\n');
        process.exit(1);
    }
}
main();
//# sourceMappingURL=test-nexah-sms.js.map