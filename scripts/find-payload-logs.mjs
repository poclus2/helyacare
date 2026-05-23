import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function findPayloadLogs() {
  try {
    await ssh.connect({
      host: '207.180.196.12',
      username: 'root',
      password: 'Vykuj3546'
    });

    console.log("=== INITIATE PAYLOAD LOGS ===");
    const { stdout } = await ssh.execCommand('docker compose logs frontend | grep -A 10 -B 2 "Tara Payload"', { cwd: '/var/www/helyacare' });
    console.log(stdout || "No logs found matching 'Tara Payload'");

  } catch (err) {
    console.error("SSH Error:", err);
  } finally {
    ssh.dispose();
  }
}

findPayloadLogs();
