import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function findCartLogs() {
  try {
    await ssh.connect({
      host: '207.180.196.12',
      username: 'root',
      password: 'Vykuj3546'
    });

    console.log("=== CART CREATION LOGS ===");
    const { stdout } = await ssh.execCommand('docker compose logs backend | grep -i "/store/carts"', { cwd: '/var/www/helyacare' });
    console.log(stdout || "No logs found matching '/store/carts'");

  } catch (err) {
    console.error("SSH Error:", err);
  } finally {
    ssh.dispose();
  }
}

findCartLogs();
