import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function checkNginx() {
  console.log("Vérification de Nginx sur le VPS...");
  try {
    await ssh.connect({
      host: '207.180.196.12',
      username: 'root',
      password: 'Vykuj3546'
    });

    const { stdout: nginxStatus } = await ssh.execCommand('systemctl status nginx || true');
    console.log("Nginx Status:", nginxStatus.split('\\n')[0]);

    const { stdout: nginxConf } = await ssh.execCommand('cat /etc/nginx/nginx.conf | grep client_max_body_size || true');
    console.log("Global client_max_body_size:", nginxConf || "Not set");

    const { stdout: sites } = await ssh.execCommand('grep -ri "client_max_body_size" /etc/nginx/sites-enabled/ || true');
    console.log("Sites client_max_body_size:", sites || "Not set");

  } catch (err) {
    console.error(err);
  } finally {
    ssh.dispose();
  }
}

checkNginx();
