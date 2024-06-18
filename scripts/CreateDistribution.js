const path = require("path");
const fs = require("fs-extra");
const archiver = require("archiver");
const chalk = require("chalk");

const distPath = path.join(__dirname, "../dist.zip");
const distDirPath = path.join(__dirname, "../dist/");

if (!fs.existsSync(distDirPath)) {
  console.log(
    chalk.red("error"),
    "dist directory not found. Please run build first!"
  );
  process.exit(1);
}

if (fs.existsSync(distPath)) {
  console.log(
    chalk.yellow("wraning"),
    "An existing dist file found. Replace it to new file..."
  );
  fs.removeSync(distPath);
}

const output = fs.createWriteStream(distPath);
const archive = archiver("zip");

output.on("close", () => {
  console.log(chalk.green("success"), "dist.zip created!");
});

archive.on("error", (err) => {
  console.log(
    chalk.red("error"),
    "An error occured while creating distribution."
  );
  throw err;
});

archive.pipe(output);
archive.directory(distDirPath, false);
archive.finalize();
