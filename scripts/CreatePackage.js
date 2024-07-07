import fs from "fs-extra";
import path from "path";
import url from "url";
import chalk from "chalk";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const POPUP_PACKAGE_PATH = path.join(__dirname, "../apps/popup");
const POPUP_DIST_PATH = path.join(POPUP_PACKAGE_PATH, "dist");
const EXTENSION_OUTPUT_PATH = path.join(__dirname, "../dist");

//  cleanup the dist folder
if (fs.existsSync(EXTENSION_OUTPUT_PATH)) {
  console.log(
    chalk.yellow("warning:"),
    "Extension output directory is not empty. Cleaning it up..."
  );
  fs.removeSync(EXTENSION_OUTPUT_PATH);
}

fs.copySync(POPUP_DIST_PATH, EXTENSION_OUTPUT_PATH);

console.log(chalk.green("success:"), "Unpacked extension package created!");
