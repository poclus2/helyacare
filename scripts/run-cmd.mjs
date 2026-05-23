import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();
const command = process.argv[2] || 'ls -la';

async function runCommand() {
  try {
    await ssh.connect({
      host: '207.180.196.12',
      username: 'root',
      password: 'Vykuj3546'
    });
    const { stdout, stderr } = await ssh.execCommand(command);
    console.log("STDOUT:", stdout);
    if (stderr) console.error("STDERR:", stderr);
  } catch (err) {
    console.error("SSH error:", err);
  } finally {
    ssh.dispose();
  }
}
runCommand();
