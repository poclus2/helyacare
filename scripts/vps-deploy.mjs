import { exec } from 'child_process';
import readline from 'readline';
import { promisify } from 'util';

const execAsync = promisify(exec);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function runSSH(user, ip, command) {
  console.log(`\n> Exécution sur ${ip}...`);
  try {
    // On utilise l'outil ssh intégré à Windows/Linux
    const { stdout, stderr } = await execAsync(`ssh ${user}@${ip} "${command}"`);
    if (stderr) console.error(`[STDERR]\n${stderr}`);
    if (stdout) console.log(`[STDOUT]\n${stdout}`);
    return true;
  } catch (error) {
    console.error(`\n❌ Erreur SSH : ${error.message}`);
    return false;
  }
}

async function main() {
  console.log("==========================================");
  console.log("🚀 HelyaCare - Assistant VPS Automatique 🚀");
  console.log("==========================================\n");

  const ip = await question("Veuillez entrer l'adresse IP de votre VPS Contabo : ");
  const user = await question("Nom d'utilisateur (par défaut: root) : ") || "root";
  const projectDir = await question("Dossier du projet (par défaut: /var/www/helyacare) : ") || "/var/www/helyacare";

  console.log("\nQue souhaitez-vous faire ?");
  console.log("1. Mettre à jour les variables d'environnement (corriger Auth.js) et relancer");
  console.log("2. Tirer les dernières modifications de GitHub (git pull) et relancer");
  console.log("3. Voir les logs du frontend (Next.js)");
  console.log("4. Voir les logs du backend (Medusa)");
  console.log("5. Redémarrer tous les conteneurs");

  const choice = await question("\nVotre choix (1-5) : ");

  switch (choice) {
    case '1':
      const authSecret = await question("Entrez votre AUTH_SECRET (ou laissez vide pour générer un aléatoire) : ") || `helya-secret-${Date.now()}`;
      
      const envUpdateCmd = `
        cd ${projectDir} &&
        sed -i 's/NEXTAUTH_SECRET/AUTH_SECRET/g' .env &&
        sed -i 's/NEXTAUTH_URL/AUTH_URL/g' .env &&
        grep -q 'AUTH_SECRET=' .env || echo '\\nAUTH_SECRET=${authSecret}' >> .env &&
        grep -q 'AUTH_URL=' .env || echo 'AUTH_URL=https://helyacare.com' >> .env &&
        grep -q 'AUTH_TRUST_HOST=' .env || echo 'AUTH_TRUST_HOST=true' >> .env &&
        docker compose up -d --build frontend
      `;
      console.log("\nMise à jour de votre fichier .env sur le VPS et reconstruction du Frontend...");
      await runSSH(user, ip, envUpdateCmd);
      console.log("✅ Variables mises à jour et Frontend relancé !");
      break;

    case '2':
      console.log("\nRécupération du code et redémarrage...");
      const gitCmd = `cd ${projectDir} && git pull origin main && docker compose up -d --build`;
      await runSSH(user, ip, gitCmd);
      console.log("✅ Mise à jour terminée !");
      break;

    case '3':
      await runSSH(user, ip, `cd ${projectDir} && docker compose logs --tail=100 -f frontend`);
      break;

    case '4':
      await runSSH(user, ip, `cd ${projectDir} && docker compose logs --tail=100 -f backend`);
      break;

    case '5':
      await runSSH(user, ip, `cd ${projectDir} && docker compose restart`);
      console.log("✅ Redémarrage effectué.");
      break;

    default:
      console.log("Choix invalide.");
  }

  rl.close();
}

main().catch(console.error);
