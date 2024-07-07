import path from "path";
import fs from "fs-extra";
import url from "url";
import archiver from "archiver";
import chalk from "chalk";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const EXTENSION_DIST_BIN_PATH = path.join(__dirname, "../dist.zip");
const EXTENSION_DIST_PATH = path.join(__dirname, "../dist");

if (!fs.existsSync(EXTENSION_DIST_PATH)) {
  console.log(
    chalk.red("error:"),
    "extension build output not found. Please run build first!"
  );
  process.exit(1);
}

if (fs.existsSync(EXTENSION_DIST_BIN_PATH)) {
  console.log(
    chalk.yellow("wraning:"),
    "An existing dist file found. Replace it to new file..."
  );
  fs.removeSync(EXTENSION_DIST_BIN_PATH);
}

const output = fs.createWriteStream(EXTENSION_DIST_BIN_PATH);
const archive = archiver("zip");

output.on("close", () => {
  console.log(chalk.green("success:"), "Compressed extension binary created!\n");
  console.log(chalk.bold("Output path:", chalk.underline(EXTENSION_DIST_BIN_PATH)), "\n");
});

archive.on("error", (err) => {
  console.log(
    chalk.red("error:"),
    "An error occured while creating distribution."
  );
  throw err;
});

archive.pipe(output);
archive.directory(EXTENSION_DIST_PATH, false);
archive.finalize();
