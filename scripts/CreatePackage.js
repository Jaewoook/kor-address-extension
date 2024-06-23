import fs from "fs-extra";
import path from "path";
import url from "url";
import chalk from "chalk";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const distDirPath = path.join(__dirname, "../dist");
const distIconsDirPath = path.join(distDirPath, "/icons");
const buildDirPath = path.join(__dirname, "../build");
const iconDisPath = path.join(__dirname, "../icons");

// console.log(distDirPath, distIconsDirPath, buildDirPath, iconDisPath);

//  cleanup the dist folder
if (fs.existsSync(distDirPath)) {
  console.log(
    chalk.yellow("warning"),
    "An existing dist directory found. Cleaning it up..."
  );
  fs.removeSync(distDirPath);
}
//  create dist directory which includes icons directory
fs.mkdirpSync(distIconsDirPath);

fs.copyFileSync(
  path.join(__dirname, "../manifest.json"),
  path.join(distDirPath, "/manifest.json")
);
fs.copySync(buildDirPath, distDirPath);
fs.copySync(iconDisPath, distIconsDirPath);

console.log(chalk.green("success"), "unpacked package created!");
