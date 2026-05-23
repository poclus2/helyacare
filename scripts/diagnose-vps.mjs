import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ssh = new NodeSSH();

async function getLogs() {
  try {
    await ssh.connect({
      host: '207.180.196.12',
      username: 'root',
      password: 'Vykuj3546'
    });

    console.log("Pulling latest code...");
    const { stdout: pullOut } = await ssh.execCommand('git pull origin main', { cwd: '/var/www/helyacare' });
    console.log(pullOut);

    console.log("Rebuilding frontend with new code...");
    const { stdout: upOut, stderr: upErr } = await ssh.execCommand('docker compose up -d --build frontend', { cwd: '/var/www/helyacare' });
    console.log(upOut);
    if (upErr) console.log(upErr.substring(0, 500));

    console.log("Done! Visit https://helyacare.com/admin to test.");
  } catch (err) {
    console.error("SSH Error:", err);
  } finally {
    ssh.dispose();
  }
}

getLogs();
