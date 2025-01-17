const fs = require('fs/promises');
const path = require('path');

async function buildPage() {
    const projectDistPath = path.join(__dirname, 'project-dist');
    const templatePath = path.join(__dirname, 'template.html');
    const componentsDirPath = path.join(__dirname, 'components');
    const stylesDirPath = path.join(__dirname, 'styles');
    const assetsDirPath = path.join(__dirname, 'assets');

    await fs.mkdir(projectDistPath, { recursive: true });

    let templateContent = await fs.readFile(templatePath, 'utf-8');

    const componentFiles = await fs.readdir(componentsDirPath);
    for (const file of componentFiles) {
        const ext = path.extname(file);
        if (ext === '.html') {
            const componentName = path.basename(file, ext);
            const componentContent = await fs.readFile(path.join(componentsDirPath, file), 'utf-8');
            const templateTag = `{{${componentName}}}`;
            templateContent = templateContent.replace(new RegExp(templateTag, 'g'), componentContent);
        }
    }

    await fs.writeFile(path.join(projectDistPath, 'index.html'), templateContent);

    const styleFiles = await fs.readdir(stylesDirPath);
    const cssWriteStream = fs.createWriteStream(path.join(projectDistPath, 'style.css'));

    for (const file of styleFiles) {
        const ext = path.extname(file);
        if (ext === '.css') {
            const cssContent = await fs.readFile(path.join(stylesDirPath, file), 'utf-8');
            cssWriteStream.write(cssContent + '\n'); 
        }
    }
    cssWriteStream.end();

    await copyDirectory(assetsDirPath, path.join(projectDistPath, 'assets'));
}

async function copyDirectory(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            await copyDirectory(srcPath, destPath);
        } else {
            await fs.copyFile(srcPath, destPath);
        }
    }
}

buildPage().catch(console.error);
