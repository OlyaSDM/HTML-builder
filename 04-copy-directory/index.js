const fs = require('fs/promises');
const path = require('path');

async function copyDir(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });

    const items = await fs.readdir(src, { withFileTypes: true });

    for (const item of items) {
      const srcPath = path.join(src, item.name);
      const destPath = path.join(dest, item.name);

      if (item.isFile()) {
        await fs.copyFile(srcPath, destPath);
      } else if (item.isDirectory()) {
        await copyDir(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error('Error while copying directory:', error);
  }
}

(async () => {
  const srcFolder = path.join(__dirname, 'files');
  const destFolder = path.join(__dirname, 'files-copy');

  try {
    await fs.rm(destFolder, { recursive: true, force: true });
  } catch (error) {
    console.error('Error while cleaning destination folder:', error);
  }

  await copyDir(srcFolder, destFolder);

  console.log('Directory copied successfully!');
})();
