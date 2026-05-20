import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function finalVPSUpdate() {
  console.log("Connexion au VPS pour récupérer la correction TypeScript...");
  try {
    await ssh.connect({
      host: '207.180.196.12',
      username: 'root',
      password: 'Vykuj3546'
    });

    const projectDir = '/var/www/helyacare';

    console.log("Git fetch origin...");
    await ssh.execCommand('git fetch origin', { cwd: projectDir });

    console.log("Git reset hard origin/main...");
    const { stdout: resetOut } = await ssh.execCommand('git reset --hard origin/main', { cwd: projectDir });
    console.log(resetOut);

    console.log("Reconstruction des conteneurs...");
    const { stdout: buildOut, stderr: buildErr } = await ssh.execCommand('docker compose build --no-cache', { cwd: projectDir });
    console.log(buildOut);
    if (buildErr) console.log("Build STDERR:", buildErr);

    console.log("Démarrage...");
    const { stdout: upOut } = await ssh.execCommand('docker compose up -d', { cwd: projectDir });
    console.log(upOut);

    console.log("Terminé !");
  } catch (err) {
    console.error(err);
  } finally {
    ssh.dispose();
  }
}

finalVPSUpdate();
