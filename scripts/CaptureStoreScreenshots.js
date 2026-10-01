// Generates 1280x800 store screenshots into images/store/ from the current build.
// Run `yarn build` first (needs VITE_JUSO_API_KEY in .env for real search results).
// Uses the locally installed Google Chrome and loads Noto Sans KR from Google Fonts.
import fs from "fs";
import os from "os";
import path from "path";
import url from "url";
import chalk from "chalk";
import { chromium } from "playwright-core";
import { preview } from "vite";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const rootPath = path.join(__dirname, "..");
const outDirPath = path.join(rootPath, "images/store");
const rawDirPath = fs.mkdtempSync(path.join(os.tmpdir(), "store-screenshots-"));
const { version } = JSON.parse(fs.readFileSync(path.join(rootPath, "manifest.json"), "utf-8"));

if (!fs.existsSync(path.join(rootPath, "build/index.html"))) {
  console.log(chalk.red("error"), "build directory not found. Please run `yarn build` first!");
  process.exit(1);
}

const THEMES = {
  light: {
    bg: "linear-gradient(135deg, #f3f8ff 0%, #d9ecff 100%)",
    brand: "#1677ff",
    ink: "#0b1f3a",
    muted: "#4a5b72",
    shadow: "rgba(22, 60, 120, 0.22)",
  },
  dark: {
    bg: "linear-gradient(135deg, #0e131c 0%, #1c2638 100%)",
    brand: "#69b1ff",
    ink: "#ffffff",
    muted: "#b6c2d6",
    shadow: "rgba(0, 0, 0, 0.55)",
  },
};

const SHOTS = [
  {
    file: "whale-store-1-search.png",
    theme: "light",
    image: "popup-results.png",
    width: 600,
    title: "주소 검색부터<br>영문 주소까지 한 번에",
    body: "도로명·지번·영문 주소와 우편번호를<br>팝업 하나에서 바로 확인하세요.",
  },
  {
    file: "whale-store-2-copy.png",
    theme: "light",
    image: "popup-copy.png",
    width: 600,
    title: "클릭 한 번으로<br>주소 복사",
    body: "필요한 항목을 누르면 바로 복사돼요.<br>해외 사이트 주소 입력도 간편하게.",
  },
  {
    file: "whale-store-3-dark.png",
    theme: "dark",
    image: "popup-dark.png",
    width: 600,
    title: "다크 모드 지원",
    body: "라이트·다크 모드 중 고르거나<br>시스템 설정에 맞춰 자동으로 바뀌어요.",
  },
  {
    file: "whale-store-4-settings.png",
    theme: "light",
    image: "options.png",
    width: 680,
    title: "검색 기록과<br>나만의 설정",
    body: "최근 검색어를 저장하고, 테마와<br>보관 개수를 원하는 대로 설정하세요.",
  },
];

const CURSOR_SVG = `<svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 2 L4 19 L8.5 14.8 L11.6 21.5 L14.3 20.3 L11.2 13.7 L17.5 13.7 Z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`;

const toDataUri = (filePath) =>
  `data:image/png;base64,${fs.readFileSync(filePath).toString("base64")}`;

// Captures the popup and options page at 2x so they stay sharp once scaled into the layout.
const captureRawScreens = async (browser, baseUrl) => {
  const context = await browser.newContext({
    viewport: { width: 500, height: 475 },
    deviceScaleFactor: 2,
    colorScheme: "light",
    locale: "ko-KR",
  });
  // Keep capture runs out of Sentry and analytics.
  await context.route(/sentry\.io|googletagmanager\.com|google-analytics\.com/, (route) =>
    route.abort(),
  );
  // Headless screenshots have no mouse cursor, so draw one for the copy shot.
  await context.addInitScript((svg) => {
    addEventListener("DOMContentLoaded", () => {
      const cursor = document.createElement("div");
      cursor.id = "fake-cursor";
      cursor.innerHTML = svg;
      Object.assign(cursor.style, {
        position: "fixed",
        zIndex: "2147483647",
        pointerEvents: "none",
        display: "none",
      });
      document.body.append(cursor);
      addEventListener(
        "mousemove",
        (e) => {
          cursor.style.left = `${e.clientX - 4}px`;
          cursor.style.top = `${e.clientY - 2}px`;
        },
        true,
      );
    });
  }, CURSOR_SVG);

  const popup = await context.newPage();
  const showCursor = (visible) =>
    popup.evaluate((v) => {
      document.getElementById("fake-cursor").style.display = v ? "block" : "none";
    }, visible);
  const search = async (keyword) => {
    const input = popup.locator('input[placeholder="검색할 주소 입력"]');
    await input.fill(keyword);
    await input.press("Enter");
    await popup.waitForFunction(
      () =>
        document.querySelector(".ant-collapse-item") &&
        !document.querySelector(".ant-input-search-btn .ant-btn-loading-icon"),
    );
    await input.blur();
    await popup.waitForTimeout(700);
  };

  await popup.goto(`${baseUrl}index.html`);
  await popup.evaluate(() => document.fonts.ready);
  // Earlier searches populate the history shown on the settings screenshot.
  await search("강남대로 323");
  await search("테헤란로 152");
  await search("세종대로 110");
  await popup.mouse.move(490, 465);
  await popup.screenshot({ path: path.join(rawDirPath, "popup-results.png") });

  const engAddress = await popup
    .locator("button", { hasText: "Sejong-daero" })
    .first()
    .boundingBox();
  const target = {
    x: engAddress.x + engAddress.width / 2 - 20,
    y: engAddress.y + engAddress.height / 2 + 2,
  };
  await showCursor(true);
  await popup.mouse.move(target.x, target.y);
  await popup.mouse.click(target.x, target.y);
  await popup.waitForTimeout(400);
  await popup.screenshot({ path: path.join(rawDirPath, "popup-copy.png") });

  await showCursor(false);
  await popup.mouse.move(490, 465);
  await popup.waitForTimeout(400);
  await popup.emulateMedia({ colorScheme: "dark" });
  await search("테헤란로 152");
  await popup.screenshot({ path: path.join(rawDirPath, "popup-dark.png") });

  const options = await context.newPage();
  await options.setViewportSize({ width: 680, height: 900 });
  await options.goto(`${baseUrl}options.html`);
  await options.evaluate(() => document.fonts.ready);
  // Outside the extension the manifest can't be read, so show the real version instead.
  await options.evaluate((v) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (walker.currentNode.nodeValue === "Unknown version") walker.currentNode.nodeValue = v;
    }
  }, version);
  await options.waitForTimeout(500);
  // Crop just below the search history list, before the long privacy policy text.
  const historyList = await options.locator("ul").first().boundingBox();
  await options.screenshot({
    path: path.join(rawDirPath, "options.png"),
    clip: { x: 0, y: 0, width: 680, height: Math.ceil(historyList.y + historyList.height + 24) },
  });

  await context.close();
};

const composeStoreScreens = async (browser) => {
  const icon = toDataUri(path.join(rootPath, "icons/icon_128.png"));
  const stage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  fs.mkdirSync(outDirPath, { recursive: true });

  for (const shot of SHOTS) {
    const t = THEMES[shot.theme];
    await stage.setContent(
      `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800&display=swap" rel="stylesheet">
<style>
  html, body { margin: 0; width: 1280px; height: 800px; overflow: hidden; }
  body { font-family: "Noto Sans KR", sans-serif; background: ${t.bg}; display: flex; align-items: center; }
  .copy { flex: 1; padding-left: 90px; padding-right: 40px; }
  .brand { display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 22px; color: ${t.brand}; }
  .brand img { width: 44px; height: 44px; border-radius: 10px; }
  h1 { font-size: 46px; line-height: 1.3; font-weight: 800; margin: 30px 0 20px; color: ${t.ink}; letter-spacing: -1px; }
  p { font-size: 21px; line-height: 1.65; color: ${t.muted}; margin: 0; }
  .shot { margin-right: 90px; border-radius: 18px; overflow: hidden; box-shadow: 0 30px 70px ${t.shadow}, 0 6px 18px ${t.shadow}; }
  .shot img { display: block; width: ${shot.width}px; }
</style></head><body>
  <div class="copy">
    <div class="brand"><img src="${icon}">주소검색</div>
    <h1>${shot.title}</h1>
    <p>${shot.body}</p>
  </div>
  <div class="shot"><img src="${toDataUri(path.join(rawDirPath, shot.image))}"></div>
</body></html>`,
      { waitUntil: "networkidle" },
    );
    await stage.evaluate(() => document.fonts.ready);
    await stage.screenshot({ path: path.join(outDirPath, shot.file) });
    console.log(chalk.green("success"), `images/store/${shot.file}`);
  }
};

const server = await preview({ root: rootPath, logLevel: "warn", preview: { port: 4173 } });
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  await captureRawScreens(browser, server.resolvedUrls.local[0]);
  await composeStoreScreens(browser);
} finally {
  await browser.close();
  await server.close();
  fs.rmSync(rawDirPath, { recursive: true, force: true });
}
