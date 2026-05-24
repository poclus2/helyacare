import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function fixReferralCode() {
  console.log("Connexion au VPS...");
  try {
    await ssh.connect({ host: '207.180.196.12', username: 'root', password: 'Vykuj3546' });
    console.log("Connecté !");

    // 1. Trouver tous les customers avec un code au mauvais format (HELYA-NOM-XXXXX)
    const findScript = `
docker exec helyacare_backend sh -c 'node -e "
const fetch = (...args) => import(\"node-fetch\").then(({default: f}) => f(...args));
const BACKEND = \"http://localhost:9000\";
async function run() {
  // Récupérer tous les customers
  const res = await fetch(BACKEND + \"/admin/customers?limit=500\", {
    headers: { Authorization: \"Bearer \$(cat /tmp/admin_token.txt 2>/dev/null || echo empty)\" }
  });
  console.log(\"status:\", res.status);
  const d = await res.json();
  const customers = d.customers || [];
  const badCodes = customers.filter(c => c.metadata?.referral_code && c.metadata.referral_code.startsWith(\"HELYA-\"));
  console.log(\"Bad codes:\", JSON.stringify(badCodes.map(c => ({id: c.id, code: c.metadata.referral_code}))));
}
run().catch(console.error);
"'
`;
    const { stdout: findOut } = await ssh.execCommand(findScript);
    console.log("Résultat recherche:", findOut);

  } catch (err) {
    console.error("Erreur:", err);
  } finally {
    ssh.dispose();
  }
}

fixReferralCode();
