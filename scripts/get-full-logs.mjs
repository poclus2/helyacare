import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function getFullLogs() {
  try {
    await ssh.connect({
      host: '207.180.196.12',
      username: 'root',
      password: 'Vykuj3546'
    });

    console.log("=== FRONTEND LOGS (tail 300) ===");
    const { stdout } = await ssh.execCommand('docker compose logs --tail=300 frontend', { cwd: '/var/www/helyacare' });
    console.log(stdout);

  } catch (err) {
    console.error("SSH Error:", err);
  } finally {
    ssh.dispose();
  }
}

getFullLogs();
