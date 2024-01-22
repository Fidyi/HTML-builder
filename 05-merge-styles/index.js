const fs = require('fs').promises;
const path = require('path');
const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
async function mergeStyles() {
  const files = await fs.readdir(stylesPath);
  const cssFiles = files.filter((file) => path.extname(file) === '.css');
  const styles = await Promise.all(
    cssFiles.map((file) => fs.readFile(path.join(stylesPath, file), 'utf-8')),
  );
  await fs.writeFile(bundlePath, styles.join('\n'));
}
mergeStyles();
