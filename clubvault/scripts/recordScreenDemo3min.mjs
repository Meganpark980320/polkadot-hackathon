import { spawn, spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { chromium } from "playwright";
import bundledChromium from "@sparticuz/chromium";
import { setupLambdaEnvironment } from "../node_modules/@sparticuz/chromium/build/esm/helper.js";
import { inflate } from "../node_modules/@sparticuz/chromium/build/esm/lambdafs.js";

const projectDir = "/home/traverse/hackathon/clubvault";
const devUrl = "http://127.0.0.1:4173/?recording=1";
const recordingsDir = "/home/traverse/hackathon/.recordings";
const rawWebm = "/home/traverse/hackathon/clubvault-demo-screenrecording-3min.webm";
const rawMp4 = "/home/traverse/hackathon/clubvault-demo-screenrecording-3min.mp4";
const finalWebm = "/home/traverse/hackathon/clubvault-demo-screenrecording-3min-final.webm";
const finalMp4 = "/home/traverse/hackathon/clubvault-demo-screenrecording-3min-final.mp4";

async function main() {
  rmSync(recordingsDir, { force: true, recursive: true });
  mkdirSync(recordingsDir, { recursive: true });

  const server = startDevServer();

  try {
    await waitForServer("http://127.0.0.1:4173");

    const browser = await launchBrowser();
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: {
        dir: recordingsDir,
        size: { width: 1280, height: 720 }
      }
    });

    const page = await context.newPage();
    const video = page.video();

    await page.goto(devUrl, { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    await page.evaluate(() => {
      document.body.style.zoom = "0.9";
    });
    await page.waitForTimeout(1500);

    await pause(7200);

    await humanScroll(page, 260, { steps: 18, delayMs: 180 });
    await pause(1500);

    await humanType(
      page,
      page.getByTestId("vault-name-input"),
      "Campus Sprint Vault",
      { clear: true, minDelay: 135, maxDelay: 225, afterMs: 1400 }
    );
    await pause(1800);
    await humanClick(page, page.getByTestId("create-vault-button"), { afterMs: 900 });
    await pause(7000);

    await pause(2200);

    await humanType(page, page.getByTestId("deposit-input"), "1.00", {
      minDelay: 260,
      maxDelay: 420,
      afterMs: 1400
    });
    await humanClick(page, page.getByTestId("deposit-button"), { afterMs: 900 });
    await pause(7500);

    await pause(2200);

    await humanType(
      page,
      page.getByTestId("prompt-input"),
      "Pay the demo editor 0.30 PAS for the final submission video and last-minute cleanup.",
      { clear: true, minDelay: 95, maxDelay: 165, afterMs: 1700 }
    );
    await humanClick(page, page.getByTestId("generate-draft-button"), { afterMs: 900 });
    await pause(8500);
    await pause(3500);
    await humanClick(page, page.getByTestId("use-draft-button"), { afterMs: 900 });
    await pause(6500);

    await humanType(page, page.getByTestId("proposal-title-input"), "Demo editor payment", {
      clear: true,
      minDelay: 130,
      maxDelay: 210,
      afterMs: 1200
    });
    await humanAppend(
      page,
      page.getByTestId("proposal-description-input"),
      " Needed before judging begins.",
      { minDelay: 95, maxDelay: 145, afterMs: 1400 }
    );

    await humanScroll(page, 470, { steps: 24, delayMs: 180 });
    await pause(1700);

    await humanType(
      page,
      page.getByTestId("proposal-recipient-input"),
      "0x8a3f63c87e0a0a6db11d54da8b3c8abc2d40d1f2",
      { minDelay: 90, maxDelay: 145, afterMs: 1600 }
    );
    await pause(1800);
    await humanClick(page, page.getByTestId("create-proposal-button"), { afterMs: 900 });
    await page.waitForFunction(
      () => document.querySelectorAll('[data-testid^="approve-button-"]').length > 0
    );
    await pause(9000);

    await humanScroll(page, 860, { steps: 28, delayMs: 190 });
    await pause(2500);

    const approveButton = page.locator('[data-testid^="approve-button-"]').first();
    const executeButton = page.locator('[data-testid^="execute-button-"]').first();
    await pause(5200);

    await humanClick(page, approveButton, { afterMs: 900 });
    await pause(10500);
    await pause(3500);

    await humanClick(page, executeButton, { afterMs: 900 });
    await pause(13500);
    await pause(18000);

    await page.close();
    await context.close();
    await browser.close();

    const sourcePath = await video.path();
    copyFileSync(sourcePath, rawWebm);
    transcodeToMp4(rawWebm, rawMp4);
    transcodeTrimmedMp4(rawWebm, finalMp4, 1);
    transcodeTrimmedWebm(rawWebm, finalWebm, 1);

    console.log(`Saved ${rawWebm}`);
    if (existsSync(rawMp4)) {
      console.log(`Saved ${rawMp4}`);
    }
    if (existsSync(finalMp4)) {
      console.log(`Saved ${finalMp4}`);
    }
    if (existsSync(finalWebm)) {
      console.log(`Saved ${finalWebm}`);
    }
  } finally {
    stopDevServer(server);
  }
}

function startDevServer() {
  const env = {
    ...process.env,
    PATH: `/home/traverse/hackathon/.tools/node/bin:${process.env.PATH || ""}`
  };

  const child = spawn("npm", ["run", "dev", "--", "--host", "127.0.0.1", "--port", "4173"], {
    cwd: projectDir,
    env,
    stdio: "ignore",
    detached: true
  });
  child.unref();

  return child;
}

async function launchBrowser() {
  try {
    await inflate(join(projectDir, "node_modules/@sparticuz/chromium/bin/al2023.tar.br"));
    setupLambdaEnvironment("/tmp/al2023/lib");
    const executablePath = await bundledChromium.executablePath();

    return await chromium.launch({
      executablePath,
      args: bundledChromium.args,
      headless: true
    });
  } catch (error) {
    console.warn("Bundled Chromium launch failed, falling back to Playwright browser.", error);
    return chromium.launch({ headless: true });
  }
}

async function waitForServer(baseUrl) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 30000) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) {
        return;
      }
    } catch {}

    await sleep(250);
  }

  throw new Error("Vite dev server did not become ready in time.");
}

async function humanClick(page, locator, options = {}) {
  await locator.scrollIntoViewIfNeeded();
  await pause(options.beforeMs || randomBetween(220, 540));
  await locator.click();
  await pause(options.afterMs || randomBetween(300, 650));
}

async function humanType(page, locator, text, options = {}) {
  await humanClick(page, locator, { afterMs: 220 });

  if (options.clear) {
    await page.keyboard.press("Control+A");
    await pause(randomBetween(180, 320));
    await page.keyboard.press("Backspace");
    await pause(randomBetween(250, 420));
  }

  for (const character of text) {
    await page.keyboard.type(character);
    await pause(characterDelay(character, options.minDelay || 120, options.maxDelay || 200));
  }

  await pause(options.afterMs || randomBetween(500, 1000));
}

async function humanAppend(page, locator, text, options = {}) {
  await humanClick(page, locator, { afterMs: 180 });
  await page.keyboard.press("End");
  await pause(randomBetween(180, 260));

  for (const character of text) {
    await page.keyboard.type(character);
    await pause(characterDelay(character, options.minDelay || 100, options.maxDelay || 160));
  }

  await pause(options.afterMs || randomBetween(500, 1000));
}

async function humanScroll(page, distance, options = {}) {
  const steps = options.steps || Math.max(12, Math.ceil(Math.abs(distance) / 45));
  const delta = distance / steps;

  for (let index = 0; index < steps; index += 1) {
    await page.mouse.wheel(0, delta);
    await pause(options.delayMs || 160);
  }
}

function transcodeToMp4(source, target) {
  const result = spawnSync(
    "python3",
    [
      "-c",
      [
        "import imageio_ffmpeg,sys; from subprocess import run;",
        "ffmpeg=imageio_ffmpeg.get_ffmpeg_exe();",
        "cmd=[ffmpeg,'-y','-i',sys.argv[1],'-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart',sys.argv[2]];",
        "raise SystemExit(run(cmd).returncode)"
      ].join(" "),
      source,
      target
    ],
    { stdio: "ignore" }
  );

  if (result.status !== 0) {
    console.warn("MP4 transcoding failed; WEBM output is still available.");
  }
}

function transcodeTrimmedMp4(source, target, trimSeconds) {
  const result = spawnSync(
    "python3",
    [
      "-c",
      [
        "import imageio_ffmpeg,sys; from subprocess import run;",
        "ffmpeg=imageio_ffmpeg.get_ffmpeg_exe();",
        "cmd=[ffmpeg,'-y','-ss',sys.argv[2],'-i',sys.argv[1],'-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart',sys.argv[3]];",
        "raise SystemExit(run(cmd).returncode)"
      ].join(" "),
      source,
      `${trimSeconds}`,
      target
    ],
    { stdio: "ignore" }
  );

  if (result.status !== 0) {
    console.warn("Trimmed MP4 rendering failed.");
  }
}

function transcodeTrimmedWebm(source, target, trimSeconds) {
  const result = spawnSync(
    "python3",
    [
      "-c",
      [
        "import imageio_ffmpeg,sys; from subprocess import run;",
        "ffmpeg=imageio_ffmpeg.get_ffmpeg_exe();",
        "cmd=[ffmpeg,'-y','-ss',sys.argv[2],'-i',sys.argv[1],'-c:v','libvpx-vp9','-b:v','0','-crf','33',sys.argv[3]];",
        "raise SystemExit(run(cmd).returncode)"
      ].join(" "),
      source,
      `${trimSeconds}`,
      target
    ],
    { stdio: "ignore" }
  );

  if (result.status !== 0) {
    console.warn("Trimmed WEBM rendering failed.");
  }
}

function stopDevServer(server) {
  try {
    process.kill(-server.pid, "SIGTERM");
  } catch {
    try {
      server.kill("SIGTERM");
    } catch {}
  }
}

function characterDelay(character, minDelay, maxDelay) {
  if (character === " ") {
    return randomBetween(minDelay * 0.6, maxDelay * 0.8);
  }
  if (/[.,-]/.test(character)) {
    return randomBetween(minDelay * 1.8, maxDelay * 2.2);
  }
  return randomBetween(minDelay, maxDelay);
}

function randomBetween(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

function pause(ms) {
  return sleep(ms);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
