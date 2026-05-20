import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function configureNginx() {
  console.log("Configuration de Nginx sur le VPS pour autoriser les gros fichiers...");
  try {
    await ssh.connect({
      host: '207.180.196.12',
      username: 'root',
      password: 'Vykuj3546'
    });

    // On crée un fichier de configuration additionnel dans conf.d
    // Tous les fichiers .conf dans /etc/nginx/conf.d/ sont automatiquement inclus dans le bloc http {}
    const command = `
      echo "client_max_body_size 50M;" > /etc/nginx/conf.d/client_max_body_size.conf &&
      nginx -t &&
      systemctl reload nginx
    `;
    
    const { stdout, stderr } = await ssh.execCommand(command);
    console.log("STDOUT:", stdout);
    if (stderr) console.log("STDERR:", stderr);

    console.log("Configuration Nginx mise à jour avec succès !");
  } catch (err) {
    console.error("Erreur:", err);
  } finally {
    ssh.dispose();
  }
}

configureNginx();
