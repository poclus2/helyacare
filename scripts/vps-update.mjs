import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function updateVPS() {
  console.log("Connexion au VPS en cours pour mettre à jour le code...");
  try {
    await ssh.connect({
      host: '207.180.196.12',
      username: 'root',
      password: 'Vykuj3546'
    });
    console.log("Connecté avec succès !");

    const projectDir = '/var/www/helyacare';

    console.log("Git pull...");
    const { stdout: pullOut, stderr: pullErr } = await ssh.execCommand('git pull origin main', { cwd: projectDir });
    console.log(pullOut);
    
    console.log("Reconstruction des conteneurs Frontend et Backend...");
    const { stdout: buildOut, stderr: buildErr } = await ssh.execCommand('docker compose up -d --build', { cwd: projectDir });
    
    if (buildOut) console.log(buildOut);
    if (buildErr) console.log("Infos Docker:", buildErr);

    console.log("Mise à jour terminée avec succès !");
  } catch (err) {
    console.error("Une erreur est survenue:", err);
  } finally {
    ssh.dispose();
  }
}

updateVPS();
