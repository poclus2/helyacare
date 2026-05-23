import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function checkWebhookLogs() {
  try {
    await ssh.connect({
      host: '207.180.196.12',
      username: 'root',
      password: 'Vykuj3546'
    });

    console.log("=== WEBHOOK-TARA LOGS ===");
    const { stdout } = await ssh.execCommand('docker compose logs frontend | grep -i webhook-tara');
    console.log(stdout || "No logs found matching 'webhook-tara'");

  } catch (err) {
    console.error("SSH Error:", err);
  } finally {
    ssh.dispose();
  }
}

checkWebhookLogs();
