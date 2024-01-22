const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'style.css');
const templatePath = path.join(__dirname, 'template.html');
//читаю html
async function readTemplate() {
  try {
    const data = await readFile(templatePath, 'utf8');
    return data;
  } catch (err) {
    console.error(err);
  }
}
//получаю массив тегов
async function findTags(template) {
  const re = /{{([^}]+)}}/g;
  const matches = template.match(re) || [];
  const tags = matches.map((match) => match.slice(2, -2));
  return tags;
}
//меняю теги на
async function replaceTags(template, tags) {
  for (let tag of tags) {
    const componentPath = path.join(__dirname, 'components', `${tag}.html`);
    try {
      const componentContent = await readFile(componentPath, 'utf8');
      template = template.replace(
        new RegExp(`{{${tag}}}`, 'g'),
        componentContent,
      );
    } catch (err) {
      console.error(err);
    }
  }
  return template;
}

async function writeIndexFile(content) {
  const indexPath = path.join(__dirname, 'project-dist', 'index.html');
  try {
    await fs.promises.mkdir(path.join(__dirname, 'project-dist'), {
      recursive: true,
    });
    await fs.promises.writeFile(indexPath, content, 'utf8');
  } catch (err) {
    console.error(err);
  }
}

async function mergeStyles() {
  const files = await fs.promises.readdir(stylesPath);
  const cssFiles = files.filter((file) => path.extname(file) === '.css');
  const styles = await Promise.all(
    cssFiles.map((file) =>
      fs.promises.readFile(path.join(stylesPath, file), 'utf-8'),
    ),
  );
  await fs.promises.writeFile(bundlePath, styles.join('\n'));
}

async function copy(src, dest) {
  const entries = await fs.promises.readdir(src, { withFileTypes: true });

  await fs.promises.mkdir(dest, { recursive: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copy(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

async function buildPage() {
  const template = await readTemplate();
  const tags = await findTags(template);
  const content = await replaceTags(template, tags);
  await writeIndexFile(content);
  await mergeStyles();
  await copy(
    path.join(__dirname, 'assets'),
    path.join(__dirname, 'project-dist', 'assets'),
  );
}

buildPage();
