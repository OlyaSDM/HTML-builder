const fs = require('fs/promises');
const path = require('path');

async function displayFileInfo() {
    try {
        const secretFolderPath = path.join(__dirname, 'secret-folder');

        const files = await fs.readdir(secretFolderPath, { withFileTypes: true });

        if (files.length === 0) {
            console.log('No files found in the secret folder.');
            return;
        }

        for (const file of files) {
            if (file.isFile()) {
                const filePath = path.join(secretFolderPath, file.name);
                
                const stats = await fs.stat(filePath);
                
                const fileName = path.parse(file.name).name;
                const fileExtension = path.extname(file.name).slice(1);
                const fileSize = (stats.size / 1024).toString();
                console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
            } else {
                console.error(`Error: ${file.name} is not a file.`);
            }
        }
    } catch (error) {
        console.error('Error reading files:', error);
    }
}

displayFileInfo();
