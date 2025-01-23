const fs = require("fs/promises");
const path = require("path");

async function createWebPage() {
  const outputDirectory = path.join(__dirname, "project-dist");
  const htmlTemplatePath = path.join(__dirname, "template.html");
  const componentsDirectory = path.join(__dirname, "components");
  const stylesDirectory = path.join(__dirname, "styles");
  const sourceAssetsPath = path.join(__dirname, "assets");
  const destinationAssetsPath = path.join(outputDirectory, "assets");

  await fs.mkdir(outputDirectory, { recursive: true });

  let templateContent = await fs.readFile(htmlTemplatePath, "utf-8");
  const placeholders = templateContent.match(/{{\s*\w+\s*}}/g) || [];

  for (const placeholder of placeholders) {
    const componentName = placeholder.replace(/{{\s*|\s*}}/g, "");
    const componentFilePath = path.join(componentsDirectory, `${componentName}.html`);

    try {
      const componentContent = await fs.readFile(componentFilePath, "utf-8");
      templateContent = templateContent.replace(placeholder, componentContent);
    } catch (error) {
      console.error(`Component file not found: ${componentName}.html`);
    }
  }

  await fs.writeFile(path.join(outputDirectory, "index.html"), templateContent);

  const styleFiles = await fs.readdir(stylesDirectory, { withFileTypes: true });
  const cssContents = await Promise.all(
    styleFiles
      .filter(file => file.isFile() && path.extname(file.name) === ".css")
      .map(async file => fs.readFile(path.join(stylesDirectory, file.name), "utf-8"))
  );

  await fs.writeFile(path.join(outputDirectory, "style.css"), cssContents.join("\n"));

  await copyAssets(sourceAssetsPath, destinationAssetsPath);

  console.log("Web page has been successfully created!");
}

async function copyAssets(source, destination) {
  await fs.mkdir(destination, { recursive: true });
  const directoryEntries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of directoryEntries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyAssets(sourcePath, destinationPath);
    } else {
      await fs.copyFile(sourcePath, destinationPath);
    }
  }
}

createWebPage().catch(error => console.error("Error creating web page:", error));
