import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function fixVPS() {
  console.log("Connexion au VPS pour réparer Git et recompiler...");
  try {
    await ssh.connect({
      host: '207.180.196.12',
      username: 'root',
      password: 'Vykuj3546'
    });

    const projectDir = '/var/www/helyacare';

    console.log("Stashing local changes...");
    const { stdout: stashOut } = await ssh.execCommand('git stash', { cwd: projectDir });
    console.log(stashOut);

    console.log("Git pull...");
    const { stdout: pullOut, stderr: pullErr } = await ssh.execCommand('git pull origin main', { cwd: projectDir });
    console.log("STDOUT:", pullOut);
    console.log("STDERR:", pullErr);

    console.log("Restoring local changes...");
    const { stdout: popOut } = await ssh.execCommand('git stash pop', { cwd: projectDir });
    console.log(popOut);

    console.log("Reconstruction des conteneurs...");
    const { stdout: buildOut, stderr: buildErr } = await ssh.execCommand('docker compose up -d --build', { cwd: projectDir });
    console.log(buildOut);
    if (buildErr) console.log("Build STDERR:", buildErr);

    console.log("Terminé !");
  } catch (err) {
    console.error(err);
  } finally {
    ssh.dispose();
  }
}

fixVPS();
