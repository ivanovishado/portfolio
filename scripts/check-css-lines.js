const fs = require("fs");
const path = require("path");

// Configuration
const MAX_LINES = 300;
const WARN_LINES = 250;
const SEARCH_DIR = "src";
const EXTENSIONS = [".css"];

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles(SEARCH_DIR);
let hasError = false;

files.forEach((file) => {
  if (EXTENSIONS.includes(path.extname(file))) {
    const content = fs.readFileSync(file, "utf8");
    const lines = content.split("\n").length;

    if (lines > MAX_LINES) {
      console.error(
        `\x1b[31mError: ${file} has ${lines} lines, which exceeds the limit of ${MAX_LINES}.\x1b[0m`,
      );
      console.error(
        `\x1b[33mTip: Break down the CSS into smaller files or use Tailwind classes.\x1b[0m`,
      );
      hasError = true;
    } else if (lines >= WARN_LINES) {
      console.warn(
        `\x1b[33mWarning: ${file} has ${lines} lines, which is approaching the limit of ${MAX_LINES}.\x1b[0m`,
      );
    }
  }
});

if (hasError) {
  process.exit(1);
} else {
  console.log(`\x1b[32m✔ All CSS files are under ${MAX_LINES} lines.\x1b[0m`);
}
