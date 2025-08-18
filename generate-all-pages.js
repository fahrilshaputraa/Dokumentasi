
const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'docs');
const allPagesFile = path.join(docsDir, 'all-pages.md');

function generatePageList(dir, relativePath = '', level = 0) {
  let content = '';
  const items = fs.readdirSync(dir);
  const indent = '  '.repeat(level);

  items.forEach(item => {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    const itemRelativePath = path.join(relativePath, item);

    if (item.startsWith('_') || item === 'index.html' || item === '.nojekyll' || item === 'docker-compose.yml' || item === 'all-pages.md') {
      return;
    }

    if (stats.isDirectory()) {
      const title = item.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const readmePath = path.join(itemPath, 'README.md');
      const link = fs.existsSync(readmePath) ? path.join(itemRelativePath, '/') : '';

      if(link) {
        content += `${indent}* [${title}](${link})\n`;
      } else {
        content += `${indent}* ${title}\n`;
      }
      content += generatePageList(itemPath, itemRelativePath, level + 1);

    } else if (item.endsWith('.md')) {
      const fileName = path.basename(item, '.md');
      if (fileName.toLowerCase() !== 'readme') {
        const link = itemRelativePath;
        const title = fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        content += `${indent}* [${title}](${link})\n`;
      }
    }
  });

  return content;
}

const pageList = generatePageList(docsDir);
fs.writeFileSync(allPagesFile, `# All Pages\n\n${pageList}`);

console.log('All pages file generated successfully!');
