import fs from "fs-extra";
import path from "path";
import url from "url";
import chalk from "chalk";

import { PRIVACY_POLICY_HTML } from "../shared/privacyPolicyContent.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, "../privacy.html");

const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>개인정보처리방침</title>
</head>
<body>${PRIVACY_POLICY_HTML}</body>
</html>
`;

fs.writeFileSync(outputPath, html);
console.log(chalk.green("success"), "privacy.html regenerated from shared/privacyPolicyContent.js");
