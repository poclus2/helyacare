import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function getLogs() {
  try {
    await ssh.connect({
      host: '207.180.196.12',
      username: 'root',
      password: 'Vykuj3546'
    });

    console.log("=== FRONTEND LOGS (tail 30) ===");
    const { stdout: frontOut } = await ssh.execCommand('docker compose logs --tail=30 frontend', { cwd: '/var/www/helyacare' });
    console.log(frontOut);

    // Removed backend logs to avoid truncation

  } catch (err) {
    console.error("SSH Error:", err);
  } finally {
    ssh.dispose();
  }
}

getLogs();
