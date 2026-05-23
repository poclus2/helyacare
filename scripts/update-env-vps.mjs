import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ssh = new NodeSSH();

async function updateEnv() {
  console.log("Connexion au VPS en cours pour mettre à jour le .env...");
  try {
    await ssh.connect({
      host: '207.180.196.12',
      username: 'root',
      password: 'Vykuj3546'
    });
    console.log("Connecté avec succès !");

    const localEnvPath = path.join(__dirname, '../.env');
    const remoteEnvPath = '/var/www/helyacare/.env';

    console.log("Téléversement du fichier .env local vers le VPS...");
    await ssh.putFile(localEnvPath, remoteEnvPath);
    console.log("Fichier .env téléversé avec succès.");

    console.log("Reconstruction et redémarrage des conteneurs pour appliquer le .env...");
    const { stdout: buildOut, stderr: buildErr } = await ssh.execCommand('docker compose up -d --build', { cwd: '/var/www/helyacare' });
    
    if (buildOut) console.log(buildOut);
    if (buildErr) console.log("Infos Docker:", buildErr);

    console.log("Mise à jour terminée avec succès !");
  } catch (err) {
    console.error("Une erreur est survenue:", err);
  } finally {
    ssh.dispose();
  }
}

updateEnv();
