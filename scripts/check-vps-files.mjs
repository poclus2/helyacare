import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function checkVPS() {
  console.log("Connexion au VPS pour vérifier les fichiers...");
  try {
    await ssh.connect({
      host: '207.180.196.12',
      username: 'root',
      password: 'Vykuj3546'
    });

    const projectDir = '/var/www/helyacare';

    console.log("Contenu de src/app/[locale]/boutique sur le VPS:");
    const { stdout: lsOut } = await ssh.execCommand('ls -la "src/app/[locale]/boutique"', { cwd: projectDir });
    console.log(lsOut);

    console.log("\nGit status sur le VPS:");
    const { stdout: gitOut } = await ssh.execCommand('git status', { cwd: projectDir });
    console.log(gitOut);

  } catch (err) {
    console.error(err);
  } finally {
    ssh.dispose();
  }
}

checkVPS();
