const fs = require('node:fs/promises');
const path = require('path');

async function mergeStyles() {
  const stylesDir = path.join(__dirname, 'styles');
  const bundleFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

  const bundleFile = await fs.open(bundleFilePath, 'w+');

  const cssFiles = await fs.readdir(stylesDir);

  const cssFilePromises = cssFiles.map(async (file) => {
    const ext = path.extname(file);
    if (ext === '.css') {
      const buffer = await fs.readFile(path.join(stylesDir, file));
      await fs.writeFile(bundleFile, buffer);
      await fs.writeFile(bundleFile, '\r\n');

      console.log(`Processed: ${file}`);
    }
  });

  await Promise.all(cssFilePromises);

  await bundleFile.close();
}

mergeStyles().catch(console.error);

