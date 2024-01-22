const fs = require('fs').promises;
const path = require('path');
async function copy() {
  const dirPath = path.join(__dirname, 'files-copy');
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath);
  }
  const copyFiles = await fs.readdir(dirPath);
  for (const file of copyFiles) {
    await fs.unlink(path.join(dirPath, file));
  }
  const files = await fs.readdir(path.join(__dirname, 'files'));
  for (const file of files) {
    const srcPath = path.join(__dirname, 'files', file);
    const destPath = path.join(dirPath, file);
    await fs.copyFile(srcPath, destPath);
  }
}
copy();
