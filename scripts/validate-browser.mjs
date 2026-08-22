#!/usr/bin/env node
/* global document, window */

import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import net from 'node:net';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const serverHost = '127.0.0.1';
const repositoryRoot = fileURLToPath(new URL('..', import.meta.url));
const astroBin = fileURLToPath(new URL('../node_modules/astro/bin/astro.mjs', import.meta.url));
process.env.NO_PROXY = [process.env.NO_PROXY, serverHost, 'localhost'].filter(Boolean).join(',');
process.env.no_proxy = [process.env.no_proxy, serverHost, 'localhost'].filter(Boolean).join(',');

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, serverHost, () => {
      const address = server.address();
      assert.ok(address && typeof address !== 'string');
      const { port } = address;
      server.close((error) => (error ? reject(error) : resolve(port)));
    });
  });
}

async function waitForHttp(url, label, timeoutMs = 20_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
      lastError = new Error(`${label} 返回 ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`${label} 未在 ${timeoutMs}ms 内就绪`, { cause: lastError });
}

function startPreviewServer(port) {
  const output = [];
  const child = spawn(
    process.execPath,
    [astroBin, 'preview', '--host', serverHost, '--port', String(port)],
    {
      cwd: repositoryRoot,
      env: {
        ...process.env,
        ASTRO_PREVIEW_BACKGROUND: '0',
        NO_PROXY: [process.env.NO_PROXY, serverHost, 'localhost'].filter(Boolean).join(','),
        no_proxy: [process.env.no_proxy, serverHost, 'localhost'].filter(Boolean).join(','),
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  const record = (chunk) => {
    output.push(String(chunk));
    if (output.length > 30) {
      output.shift();
    }
  };
  child.stdout.on('data', record);
  child.stderr.on('data', record);
  return { child, output };
}

async function launchBrowser() {
  try {
    return { browser: await chromium.launch({ headless: true }), cleanup: () => {} };
  } catch (nativeError) {
    const windowsChrome = '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe';
    if (!process.env.WSL_DISTRO_NAME || !existsSync(windowsChrome)) {
      throw nativeError;
    }

    // WSL mirrored networking can reserve arbitrary high ports independently on Windows.
    // Keep the fallback on Chromium's conventional local debugging port.
    const debugPort = 9333;
    const windowsTemp = execFileSync('cmd.exe', ['/d', '/s', '/c', 'echo %TEMP%'], {
      encoding: 'utf8',
    }).trim();
    const profile = `${windowsTemp}\\crimson-troupe-browser-${process.pid}`;
    const chromeProcess = spawn(
      windowsChrome,
      [
        '--headless=new',
        '--disable-gpu',
        '--no-proxy-server',
        `--remote-debugging-port=${debugPort}`,
        `--remote-debugging-address=${serverHost}`,
        `--user-data-dir=${profile}`,
        'about:blank',
      ],
      { stdio: 'ignore' },
    );
    try {
      const endpoint = `http://${serverHost}:${debugPort}`;
      await waitForHttp(`${endpoint}/json/version`, 'Windows Chromium CDP');
      const browser = await chromium.connectOverCDP(endpoint);
      return {
        browser,
        cleanup: () => {
          if (!chromeProcess.killed) {
            chromeProcess.kill();
          }
          try {
            execFileSync('cmd.exe', [
              '/d',
              '/s',
              '/c',
              `if exist "${profile}" rmdir /s /q "${profile}"`,
            ]);
          } catch {
            // Browser state is local-only; a locked profile can be removed by the OS later.
          }
        },
      };
    } catch (fallbackError) {
      chromeProcess.kill();
      throw new AggregateError(
        [nativeError, fallbackError],
        '无法启动 Playwright Chromium；请运行 npx playwright install --with-deps chromium。',
        { cause: fallbackError },
      );
    }
  }
}

async function assertNoHorizontalLoss(page, label) {
  const result = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
    main: document.querySelector('main')?.getBoundingClientRect().toJSON(),
  }));
  assert.ok(result.main, `${label} 缺少 main`);
  assert.ok(
    result.scrollWidth <= result.viewportWidth + 1,
    `${label} 横向溢出：${result.scrollWidth} > ${result.viewportWidth}`,
  );
  assert.ok(result.main.x >= -1, `${label} 的 main 左侧超出视口`);
  assert.ok(result.main.right <= result.viewportWidth + 1, `${label} 的 main 右侧超出视口`);
}

function trackUnexpectedErrors(page, allowed = []) {
  const errors = [];
  page.on('pageerror', (error) => {
    if (!allowed.some((pattern) => pattern.test(error.message))) {
      errors.push(error.message);
    }
  });
  return () => assert.deepEqual(errors, [], `浏览器页面出现未预期异常：${errors.join(' | ')}`);
}

const port = await getFreePort();
const origin = `http://${serverHost}:${port}`;
const preview = startPreviewServer(port);
let browserSession;

try {
  await waitForHttp(`${origin}/yan/`, 'Astro preview');
  browserSession = await launchBrowser();
  const { browser } = browserSession;

  const desktop = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const desktopPage = await desktop.newPage();
  const assertDesktopErrors = trackUnexpectedErrors(desktopPage);
  await desktopPage.goto(`${origin}/yan/`);
  await desktopPage.locator('h1').waitFor();
  await assertNoHorizontalLoss(desktopPage, '1280px 炎国表站');
  const selector = desktopPage.locator('[data-edition-selector]');
  const summary = selector.locator('summary');
  await summary.focus();
  await desktopPage.keyboard.press('Enter');
  assert.notEqual(await selector.getAttribute('open'), null);
  await desktopPage.keyboard.press('Escape');
  assert.equal(await selector.getAttribute('open'), null);
  assert.equal(await summary.evaluate((element) => element === document.activeElement), true);
  assertDesktopErrors();
  await desktop.close();

  const ticketContext = await browser.newContext({ viewport: { width: 320, height: 800 } });
  await ticketContext.addInitScript(() => {
    Math.random = () => 0.1;
  });
  const ticketPage = await ticketContext.newPage();
  const assertTicketErrors = trackUnexpectedErrors(ticketPage);
  await ticketPage.goto(`${origin}/yan/tickets/`);
  await ticketPage.locator('[data-ticketing-app]:not([hidden])').waitFor();
  await assertNoHorizontalLoss(ticketPage, '320px 炎国票务');
  await ticketPage.locator('[data-ticket-select]').first().check();
  await ticketPage.locator('[data-ticket-start]').click();
  await ticketPage.locator('[data-ticket-flow]:not([hidden])').waitFor();
  assert.equal(
    await ticketPage
      .locator('[data-ticket-flow-title]')
      .evaluate((element) => element === document.activeElement),
    true,
  );
  await ticketPage.locator('[data-ticket-action="resolve"]').click();
  await ticketPage.locator('[data-ticket-result]:not([hidden])').waitFor();
  assert.equal(
    await ticketPage
      .locator('#ticket-result-title')
      .evaluate((element) => element === document.activeElement),
    true,
  );
  const ticketSource = await ticketPage.locator('.issued-ticket > img').getAttribute('src');
  assert.match(ticketSource ?? '', /^data:image\/svg\+xml/u);
  assert.match(decodeURIComponent(ticketSource ?? ''), /data-ticket-field="title"/u);
  await assertNoHorizontalLoss(ticketPage, '320px 炎国票务结果');
  assertTicketErrors();
  await ticketContext.close();

  const archiveContext = await browser.newContext({
    viewport: { width: 320, height: 800 },
    reducedMotion: 'reduce',
  });
  await archiveContext.addInitScript(() => {
    sessionStorage.setItem(
      'crimson-troupe:archive-pollution:v2',
      JSON.stringify({ version: 2, level: 3, eventCount: 8, variant: 1 }),
    );
  });
  const archivePage = await archiveContext.newPage();
  const assertArchiveErrors = trackUnexpectedErrors(archivePage);
  await archivePage.goto(`${origin}/yan/archive/site/1091/`);
  await archivePage.locator('html[data-pollution-level="3"]').waitFor();
  await archivePage.locator('[data-archive-projection]:not([hidden])').waitFor();
  await archivePage.locator('[data-world-switch="front"]').waitFor();
  await assertNoHorizontalLoss(archivePage, '320px 炎国三级污染里站');
  assertArchiveErrors();
  await archiveContext.close();

  const noScriptContext = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 800 },
  });
  const noScriptPage = await noScriptContext.newPage();
  await noScriptPage.goto(`${origin}/hig/search/`);
  await noScriptPage.locator('[data-search-fallback]').waitFor();
  await assertNoHorizontalLoss(noScriptPage, '390px 东国无脚本搜索');
  await noScriptPage.goto(`${origin}/hig/tickets/`);
  await noScriptPage.locator('[data-ticket-fallback]').waitFor();
  assert.equal(await noScriptPage.locator('[data-ticketing-app]').getAttribute('hidden'), '');
  await noScriptContext.close();

  const failedSearchContext = await browser.newContext({ viewport: { width: 390, height: 800 } });
  await failedSearchContext.addInitScript(() => {
    JSON.parse = () => {
      throw new Error('intentional-search-initialization-failure');
    };
  });
  const failedSearchPage = await failedSearchContext.newPage();
  const assertFailedSearchErrors = trackUnexpectedErrors(failedSearchPage, [
    /intentional-search-initialization-failure/u,
  ]);
  await failedSearchPage.goto(`${origin}/col/search/`);
  await failedSearchPage.locator('[data-search-fallback]').waitFor();
  assert.equal(await failedSearchPage.locator('[data-search-enhanced]').getAttribute('hidden'), '');
  await assertNoHorizontalLoss(failedSearchPage, '390px 哥伦比亚搜索初始化失败');
  assertFailedSearchErrors();
  await failedSearchContext.close();

  console.log(
    'browser validation passed: desktop selector, 320px ticket focus/artifact, archive level 3/reduced motion, no-JS fallback, search failure fallback',
  );
} catch (error) {
  const serverOutput = preview.output.join('').trim();
  if (serverOutput) {
    console.error(serverOutput);
  }
  throw error;
} finally {
  await browserSession?.browser.close().catch(() => {});
  browserSession?.cleanup();
  preview.child.kill('SIGTERM');
}
