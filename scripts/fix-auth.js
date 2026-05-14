const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  });
  return Array.prototype.concat(...files);
}

const files = getFiles('src/app/api').filter(f => f.endsWith('.ts'));
let changed = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('Basic ${Buffer.from(`${API_KEY}:`).toString("base64")}')) {
    content = content.replace(/Basic \$\{Buffer\.from\(`\$\{API_KEY\}:`\)\.toString\("base64"\)\}/g, 'Bearer ${API_KEY}');
    fs.writeFileSync(file, content);
    console.log('Updated', file);
    changed++;
  }
}
console.log('Total files changed:', changed);
