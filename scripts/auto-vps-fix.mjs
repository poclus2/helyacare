import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function fixVPS() {
  console.log("Connexion au VPS en cours...");
  try {
    await ssh.connect({
      host: '207.180.196.12',
      username: 'root',
      password: 'Vykuj3546'
    });
    console.log("Connecté avec succès !");

    const projectDir = '/var/www/helyacare';

    console.log("Lecture du fichier .env...");
    const { stdout: envContent, stderr: envErr } = await ssh.execCommand('cat .env', { cwd: projectDir });
    
    if (envErr && !envContent) {
      console.error("Erreur lors de la lecture du .env :", envErr);
      return;
    }

    let newEnv = envContent;
    
    // Remplacer NEXTAUTH_SECRET par AUTH_SECRET
    if (newEnv.includes('NEXTAUTH_SECRET=')) {
      newEnv = newEnv.replace(/NEXTAUTH_SECRET=/g, 'AUTH_SECRET=');
    } else if (!newEnv.includes('AUTH_SECRET=')) {
      newEnv += `\nAUTH_SECRET=helya-secret-${Date.now()}`;
    }

    // Remplacer NEXTAUTH_URL par AUTH_URL
    if (newEnv.includes('NEXTAUTH_URL=')) {
      newEnv = newEnv.replace(/NEXTAUTH_URL=/g, 'AUTH_URL=');
    } else if (!newEnv.includes('AUTH_URL=')) {
      newEnv += `\nAUTH_URL=https://helyacare.com`;
    }

    // Ajouter AUTH_TRUST_HOST
    if (!newEnv.includes('AUTH_TRUST_HOST=')) {
      newEnv += `\nAUTH_TRUST_HOST=true`;
    }

    // Assurez-vous que les URLs sont correctes
    newEnv = newEnv.replace(/AUTH_URL=http:\/\/localhost:3000.*/g, 'AUTH_URL=https://helyacare.com');
    newEnv = newEnv.replace(/NEXT_PUBLIC_BASE_URL=http:\/\/localhost:3000.*/g, 'NEXT_PUBLIC_BASE_URL=https://helyacare.com');

    // Sauvegarder le nouveau .env
    console.log("Mise à jour du fichier .env sur le serveur...");
    const base64Env = Buffer.from(newEnv).toString('base64');
    await ssh.execCommand(`echo ${base64Env} | base64 -d > .env`, { cwd: projectDir });
    
    // Aussi mettre à jour docker-compose.yml si nécessaire (pour ajouter AUTH_SECRET)
    // On va faire un git pull pour récupérer la modif de docker-compose.yml que nous avons faite (si elle a été pushée)
    // Mais on n'a pas commité localement. 
    // Mettons à jour directement le docker-compose sur le serveur
    console.log("Mise à jour de docker-compose.yml...");
    const { stdout: dcContent } = await ssh.execCommand('cat docker-compose.yml', { cwd: projectDir });
    let newDc = dcContent;
    if (!newDc.includes('AUTH_SECRET=')) {
      newDc = newDc.replace('- MEDUSA_API_KEY=${MEDUSA_API_KEY}', `- MEDUSA_API_KEY=\${MEDUSA_API_KEY}\n      - AUTH_SECRET=\${AUTH_SECRET}\n      - AUTH_URL=\${AUTH_URL:-https://helyacare.com}\n      - AUTH_TRUST_HOST=true`);
      const base64Dc = Buffer.from(newDc).toString('base64');
      await ssh.execCommand(`echo ${base64Dc} | base64 -d > docker-compose.yml`, { cwd: projectDir });
    }

    console.log("Reconstruction et redémarrage du conteneur Frontend...");
    const { stdout: buildOut, stderr: buildErr } = await ssh.execCommand('docker compose up -d --build frontend', { cwd: projectDir });
    
    if (buildOut) console.log(buildOut);
    if (buildErr) console.log("Infos Docker:", buildErr);

    console.log("Opération terminée avec succès !");
  } catch (err) {
    console.error("Une erreur est survenue:", err);
  } finally {
    ssh.dispose();
  }
}

fixVPS();
