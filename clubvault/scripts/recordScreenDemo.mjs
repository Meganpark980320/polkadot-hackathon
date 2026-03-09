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
const outputWebm = "/home/traverse/hackathon/clubvault-demo-screenrecording.webm";
const outputMp4 = "/home/traverse/hackathon/clubvault-demo-screenrecording.mp4";

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
    await page.waitForTimeout(1500);
    await page.evaluate(() => {
      document.body.style.zoom = "0.9";
    });
    await page.waitForTimeout(1000);

    await page.mouse.wheel(0, 360);
    await page.waitForTimeout(700);

    await page.getByTestId("vault-name-input").click();
    await page.getByTestId("vault-name-input").press("Control+A");
    await page.getByTestId("vault-name-input").type("Campus Sprint Vault", { delay: 35 });
    await page.waitForTimeout(350);
    await page.getByTestId("create-vault-button").click();
    await page.waitForTimeout(1200);

    await page.getByTestId("deposit-input").click();
    await page.getByTestId("deposit-input").type("1.00", { delay: 70 });
    await page.waitForTimeout(300);
    await page.getByTestId("deposit-button").click();
    await page.waitForTimeout(1400);

    await page.getByTestId("prompt-input").click();
    await page.getByTestId("prompt-input").press("Control+A");
    await page
      .getByTestId("prompt-input")
      .type("Pay the demo editor 0.30 PAS for the final submission video.", { delay: 25 });
    await page.waitForTimeout(450);
    await page.getByTestId("generate-draft-button").click();
    await page.waitForTimeout(1200);
    await page.getByTestId("use-draft-button").click();
    await page.waitForTimeout(1200);

    await page.mouse.wheel(0, 520);
    await page.waitForTimeout(850);

    await page.getByTestId("proposal-recipient-input").click();
    await page
      .getByTestId("proposal-recipient-input")
      .type("0x8a3f63c87e0a0a6db11d54da8b3c8abc2d40d1f2", { delay: 18 });
    await page.waitForTimeout(350);
    await page.getByTestId("create-proposal-button").click();
    await page.waitForFunction(
      () => document.querySelectorAll('[data-testid^="approve-button-"]').length > 0
    );
    await page.waitForTimeout(1200);

    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(1200);

    const approveButton = page.locator('[data-testid^="approve-button-"]').first();
    const executeButton = page.locator('[data-testid^="execute-button-"]').first();

    await approveButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await approveButton.click();
    await page.waitForTimeout(1400);
    await executeButton.click();
    await page.waitForTimeout(3200);

    await page.close();
    await context.close();
    await browser.close();

    const sourcePath = await video.path();
    copyFileSync(sourcePath, outputWebm);
    transcodeToMp4(outputWebm, outputMp4);

    console.log(`Saved ${outputWebm}`);
    if (existsSync(outputMp4)) {
      console.log(`Saved ${outputMp4}`);
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

function stopDevServer(server) {
  try {
    process.kill(-server.pid, "SIGTERM");
  } catch {
    try {
      server.kill("SIGTERM");
    } catch {}
  }
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
    return chromium.launch({
      headless: true
    });
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
