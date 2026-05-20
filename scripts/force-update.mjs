import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function forceUpdateVPS() {
  console.log("Connexion au VPS en cours pour forcer le rebuild sans cache...");
  try {
    await ssh.connect({
      host: '207.180.196.12',
      username: 'root',
      password: 'Vykuj3546'
    });
    console.log("Connecté avec succès !");

    const projectDir = '/var/www/helyacare';

    console.log("Git pull (au cas où)...");
    const { stdout: pullOut } = await ssh.execCommand('git pull origin main', { cwd: projectDir });
    console.log(pullOut);
    
    console.log("Reconstruction forcée des conteneurs Frontend et Backend (--no-cache)...");
    // Build without cache to force it
    const { stdout: buildOut, stderr: buildErr } = await ssh.execCommand('docker compose build --no-cache', { cwd: projectDir });
    if (buildOut) console.log(buildOut);
    if (buildErr) console.log("Infos Docker Build:", buildErr);

    console.log("Redémarrage des conteneurs...");
    const { stdout: upOut, stderr: upErr } = await ssh.execCommand('docker compose up -d', { cwd: projectDir });
    if (upOut) console.log(upOut);
    if (upErr) console.log("Infos Docker Up:", upErr);

    console.log("Mise à jour FORCÉE terminée avec succès !");
  } catch (err) {
    console.error("Une erreur est survenue:", err);
  } finally {
    ssh.dispose();
  }
}

forceUpdateVPS();
