#!/usr/bin/env node
/* global document, window */

import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import net from 'node:net';
import { fileURLToPath } from 'node:url';

import { chromium, firefox, webkit } from 'playwright';

import { currentArchiveSnapshot } from '../src/data/archive-snapshots.ts';
import { buildSnapshot } from '../src/data/content/resolve.ts';
import { builtEditions, editions } from '../src/data/editions.ts';
import { getLocalization } from '../src/data/localized/resolve.ts';
import { derivePollutionComposition } from '../src/scripts/pollution-state.ts';

const serverHost = '127.0.0.1';
const browserEngine = process.env.BROWSER_ENGINE ?? 'chromium';
const chromeExecutablePath = process.env.BROWSER_CHROME_EXECUTABLE_PATH;
const edgeExecutablePath = process.env.BROWSER_EDGE_EXECUTABLE_PATH;
const repositoryRoot = fileURLToPath(new URL('..', import.meta.url));
const astroBin = fileURLToPath(new URL('../node_modules/astro/bin/astro.mjs', import.meta.url));
const expectedArchiveSeatCount = buildSnapshot.performanceEntries.filter(
  ([, performance]) =>
    performance.world === 'archive' &&
    performance.collection === 'current' &&
    performance.status === 'scheduled' &&
    performance.ticketAvailability.state === 'on-sale',
).length;
const expectedArchiveSeats = buildSnapshot.performanceEntries.flatMap(
  ([performanceId, performance]) =>
    performance.world === 'archive' &&
    performance.collection === 'current' &&
    performance.status === 'scheduled' &&
    performance.ticketAvailability.state === 'on-sale'
      ? [{ performanceId, offers: performance.ticketAvailability.offers }]
      : [],
);
const expectedArchiveCurrentCount = buildSnapshot.performanceEntries.filter(
  ([, performance]) => performance.world === 'archive' && performance.collection === 'current',
).length;
const expectedArchiveHistoryCount = buildSnapshot.performanceEntries.filter(
  ([, performance]) => performance.world === 'archive' && performance.collection === 'history',
).length;
process.env.NO_PROXY = [process.env.NO_PROXY, serverHost, 'localhost'].filter(Boolean).join(',');
process.env.no_proxy = [process.env.no_proxy, serverHost, 'localhost'].filter(Boolean).join(',');

function archivePath(routePrefix, segment = '') {
  const suffix = segment ? `${segment.replace(/^\/+/, '')}/` : '';
  return `/${routePrefix}/archive/site/${currentArchiveSnapshot.routeSegment}/${suffix}`;
}

function pollutionStateForComposition(level, pageType, pathname, composition) {
  for (let eventCount = Math.max(3, level + 2); eventCount <= 30; eventCount += 1) {
    for (const variant of [0, 1, 2]) {
      const state = { version: 2, level, eventCount, variant };
      if (derivePollutionComposition(state, pageType, pathname) === composition) {
        return state;
      }
    }
  }
  throw new Error(`无法为污染等级 ${level} / 构图 ${composition} 派生测试状态`);
}

async function assertArchiveProjectionList(page, expectedCount, label) {
  const cards = page.locator('.archive-performance-list > li');
  assert.equal(await cards.count(), expectedCount, `${label} 的记录数量不得改变`);
  for (const field of ['title', 'date-time', 'venue', 'status']) {
    const values = cards.locator(`[data-archive-projection-field="${field}"]:visible`);
    assert.equal(await values.count(), expectedCount, `${label} 的 ${field} 应逐项投影`);
    assert.equal(
      new Set(await values.allTextContents()).size,
      1,
      `${label} 的 ${field} 应收束为同一可见值`,
    );
  }
  assert.equal(
    await cards
      .locator('[data-archive-projection-source]')
      .evaluateAll((elements) =>
        elements.every((element) => window.getComputedStyle(element).display === 'none'),
      ),
    true,
    `${label} 不应同时显示等级 0 源字段`,
  );
  assert.equal(
    await cards.locator('a[data-archive-invitation-trigger][href]').count(),
    expectedCount,
    `${label} 应保留每项原合法链接与邀请入口`,
  );
}

async function assertArchiveVisualLayer(page, label, reducedMotion = false) {
  const layer = page.locator('[data-pollution-visual-layer]');
  assert.equal(await layer.count(), 1, `${label} 应且只应有一个污染装饰层`);
  assert.equal(await layer.getAttribute('aria-hidden'), 'true', `${label} 装饰层必须退出语义树`);
  assert.equal(
    await layer.locator('a, button, input, select, textarea').count(),
    0,
    `${label} 装饰层不得包含交互控件`,
  );
  assert.equal(
    await layer.evaluate((element) => window.getComputedStyle(element).pointerEvents),
    'none',
    `${label} 装饰层不得截获指针`,
  );
  const echoes = layer.locator('.archive-pollution-stage__echo:visible');
  assert.equal(await echoes.count(), 4, `${label} 应显示四个本地化档案视觉副本`);
  assert.equal(
    await echoes.evaluateAll((elements) =>
      elements.every((element) => window.getComputedStyle(element).pointerEvents === 'none'),
    ),
    true,
    `${label} 的视觉副本不得截获指针`,
  );
  const taskControls = page.locator('main a:visible, main button:visible, main select:visible');
  assert.ok(await taskControls.count(), `${label} 应保留可操作的任务层`);
  assert.ok(
    await taskControls.evaluateAll((elements) =>
      elements.some((element) => window.getComputedStyle(element).transform !== 'none'),
    ),
    `${label} 的非保护叙事控件应参与有界空间失序`,
  );
  assert.equal(
    await taskControls.evaluateAll((elements) =>
      elements.every((element) => {
        const bounds = element.getBoundingClientRect();
        return (
          bounds.width > 0 &&
          bounds.height > 0 &&
          window.getComputedStyle(element).pointerEvents !== 'none'
        );
      }),
    ),
    true,
    `${label} 的叙事控件在失序后仍应具有可命中的真实区域`,
  );
  const protectedControls = page.locator(
    '[data-pollution-safe] a:visible, [data-pollution-safe] button:visible, [data-pollution-safe] summary:visible',
  );
  assert.ok(await protectedControls.count(), `${label} 应保留显式污染保护控件`);
  assert.equal(
    await protectedControls.evaluateAll((elements) =>
      elements.every((element) => window.getComputedStyle(element).transform === 'none'),
    ),
    true,
    `${label} 的主导航、国家版本与退出控件不得空间失序`,
  );
  if (reducedMotion) {
    assert.equal(
      await layer.evaluate((element) => window.getComputedStyle(element).animationName),
      'none',
      `${label} 在减少动态效果下不得播放失序动画`,
    );
  }
}

async function assertArchiveInvitationArtifact(page, localization, label, reducedMotion = false) {
  const invitation = page.locator('[data-archive-invitation][open]');
  await invitation.waitFor();
  if (!reducedMotion) {
    await page.waitForTimeout(520);
  }
  assert.equal(
    (await invitation.locator('h2').textContent())?.trim(),
    localization.archiveProjection.invitation.title,
    `${label} 应使用当前国家版本邀请标题`,
  );
  assert.equal(
    await invitation.locator('.archive-invitation__misprint[aria-hidden="true"]').count(),
    1,
    `${label} 应包含退出语义树的错版层`,
  );
  assert.deepEqual(
    await invitation
      .locator('.archive-invitation__register > div')
      .evaluateAll((rows) => rows.map((row) => row.dataset.registerIndex)),
    ['01', '02', '03', '04'],
    `${label} 应保留四项实体登记字段`,
  );
  const overlap = await invitation.evaluate((dialog) => {
    const seal = dialog.querySelector('.archive-invitation__seal')?.getBoundingClientRect();
    const copy = dialog.querySelector('.archive-invitation__copy')?.getBoundingClientRect();
    const register = dialog.querySelector('.archive-invitation__register')?.getBoundingClientRect();
    const intersects = (first, second) =>
      Boolean(
        first &&
        second &&
        first.left < second.right &&
        first.right > second.left &&
        first.top < second.bottom &&
        first.bottom > second.top,
      );
    return {
      copy: intersects(seal, copy),
      register: intersects(seal, register),
      backdrop: window.getComputedStyle(dialog, '::backdrop').backgroundImage,
      animationName: window.getComputedStyle(dialog).animationName,
      transform: window.getComputedStyle(dialog).transform,
    };
  });
  assert.deepEqual(
    { copy: overlap.copy, register: overlap.register },
    { copy: true, register: true },
    `${label} 的剧团印章应跨越正文与登记格`,
  );
  assert.notEqual(overlap.backdrop, 'none', `${label} 应保留可见的污染页面背景`);
  assert.notEqual(overlap.transform, 'none', `${label} 应表现为错版实体而非规整系统卡片`);
  if (reducedMotion) {
    assert.equal(overlap.animationName, 'none', `${label} 在减少动态效果下应直接显示静态终态`);
  }
}

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

async function waitForHttp(url, label, timeoutMs = 40_000) {
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
  if (browserEngine === 'firefox') {
    return { browser: await firefox.launch({ headless: true }), cleanup: () => {} };
  }
  if (browserEngine === 'webkit') {
    return { browser: await webkit.launch({ headless: true }), cleanup: () => {} };
  }
  if (browserEngine === 'chrome') {
    return {
      browser: await chromium.launch({
        headless: true,
        ...(chromeExecutablePath
          ? { executablePath: chromeExecutablePath }
          : { channel: 'chrome' }),
      }),
      cleanup: () => {},
    };
  }
  if (browserEngine === 'edge') {
    return {
      browser: await chromium.launch({
        headless: true,
        ...(edgeExecutablePath ? { executablePath: edgeExecutablePath } : { channel: 'msedge' }),
      }),
      cleanup: () => {},
    };
  }
  if (browserEngine !== 'chromium') {
    throw new Error('BROWSER_ENGINE 只能是 chromium、chrome、firefox、webkit 或 edge');
  }
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
    offenders: [...document.querySelectorAll('body *')]
      .map((element) => ({
        element: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${[
          ...element.classList,
        ]
          .map((className) => `.${className}`)
          .join('')}`,
        bounds: element.getBoundingClientRect().toJSON(),
      }))
      .filter(({ bounds }) => bounds.left < -1 || bounds.right > window.innerWidth + 1)
      .slice(0, 8),
  }));
  assert.ok(result.main, `${label} 缺少 main`);
  assert.ok(
    result.scrollWidth <= result.viewportWidth + 1,
    `${label} 横向溢出：${result.scrollWidth} > ${result.viewportWidth}；${JSON.stringify(result.offenders)}`,
  );
  assert.ok(result.main.x >= -1, `${label} 的 main 左侧超出视口`);
  assert.ok(result.main.right <= result.viewportWidth + 1, `${label} 的 main 右侧超出视口`);
}

async function assertControlsWithinViewport(page, selector, label) {
  const violations = await page.locator(selector).evaluateAll((elements) =>
    elements
      .filter((element) => {
        const style = window.getComputedStyle(element);
        const bounds = element.getBoundingClientRect();
        return style.visibility !== 'hidden' && style.display !== 'none' && bounds.width > 0;
      })
      .map((element) => ({
        label: element.getAttribute('aria-label') ?? element.textContent?.trim() ?? element.tagName,
        bounds: element.getBoundingClientRect().toJSON(),
      }))
      .filter(({ bounds }) => bounds.left < -1 || bounds.right > window.innerWidth + 1),
  );
  assert.deepEqual(violations, [], `${label} 的关键控件不得被水平裁切`);
}

async function assertEditorialAlternation(page, listSelector, visualSelector, copySelector, label) {
  const rows = page.locator(`${listSelector} > li`);
  assert.ok((await rows.count()) >= 2, `${label} 至少需要两行才能验证交替编排`);
  const positions = await rows.evaluateAll(
    (items, selectors) =>
      items.slice(0, 2).map((item) => ({
        visual: item.querySelector(selectors.visual)?.getBoundingClientRect().toJSON(),
        copy: item.querySelector(selectors.copy)?.getBoundingClientRect().toJSON(),
      })),
    { visual: visualSelector, copy: copySelector },
  );
  assert.ok(
    positions.every(({ visual, copy }) => visual && copy),
    `${label} 缺少图像或文案区`,
  );
  assert.ok(positions[0].visual.x < positions[0].copy.x, `${label} 首行应为图左文右`);
  assert.ok(positions[1].visual.x > positions[1].copy.x, `${label} 次行应为文左图右`);
}

async function assertEditorialMobileOrder(page, listSelector, visualSelector, copySelector, label) {
  const positions = await page.locator(`${listSelector} > li`).evaluateAll(
    (items, selectors) =>
      items.map((item) => ({
        visual: item.querySelector(selectors.visual)?.getBoundingClientRect().toJSON(),
        copy: item.querySelector(selectors.copy)?.getBoundingClientRect().toJSON(),
      })),
    { visual: visualSelector, copy: copySelector },
  );
  assert.ok(positions.length > 0, `${label} 缺少演出行`);
  assert.ok(
    positions.every(({ visual, copy }) => visual && copy),
    `${label} 缺少图像或文案区`,
  );
  assert.ok(
    positions.every(({ visual, copy }) => visual.bottom <= copy.top + 1),
    `${label} 应统一先显示封面再显示文案`,
  );
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
  await assertEditorialAlternation(
    desktopPage,
    '.front-performance-grid--home-editorial',
    '.production-visual',
    '.front-performance-card__copy',
    '1280px 炎国表站首页',
  );
  assert.equal(
    await desktopPage.locator('.front-performance-grid--home-editorial > li').count(),
    buildSnapshot.homepagePerformanceIds.front.length,
    '表站首页应只装配显式策展集合',
  );
  const archiveCatalog = desktopPage.locator('.archive-catalog');
  assert.equal(await archiveCatalog.locator('li').count(), 3, '表站页脚应显示三条馆藏记录');
  assert.equal(await archiveCatalog.locator('a').count(), 1, '只有当前快照可以进入');
  assert.equal(await archiveCatalog.locator('.archive-catalog__damaged').count(), 2);
  assert.equal(
    await archiveCatalog.locator('a').evaluate((link) => window.getComputedStyle(link).cursor),
    'help',
  );
  assert.match(
    (await archiveCatalog.locator('a').getAttribute('href')) ?? '',
    new RegExp(`/archive/site/${currentArchiveSnapshot.routeSegment}/$`, 'u'),
  );
  const selector = desktopPage.locator('[data-edition-selector]');
  assert.equal(
    await selector.locator('li').count(),
    builtEditions.length,
    'preview 应显示当前构建集合的全部版本选项',
  );
  assert.equal(
    await selector.locator('li .edition-badge').count(),
    builtEditions.length,
    '每个版本选项都应显示徽记',
  );
  const summary = selector.locator('summary');
  await summary.focus();
  await desktopPage.keyboard.press('Enter');
  assert.notEqual(await selector.getAttribute('open'), null);
  await desktopPage.keyboard.press('Escape');
  assert.equal(await selector.getAttribute('open'), null);
  assert.equal(await summary.evaluate((element) => element === document.activeElement), true);
  await desktopPage.goto(`${origin}/yan/performances/`);
  assert.equal(
    await desktopPage.locator('.front-performance-grid--home-editorial').count(),
    0,
    '表站完整本季列表不得套用首页编排',
  );
  assert.equal(
    await desktopPage.locator('.front-performance-grid--catalog > li').count(),
    buildSnapshot.performanceEntries.filter(
      ([, performance]) => performance.world === 'front' && performance.collection === 'current',
    ).length,
    '表站完整本季列表不得被首页策展集合裁剪',
  );
  await desktopPage.goto(`${origin}/yan/search/?q=${encodeURIComponent('演出')}`);
  await desktopPage.locator('[data-search-enhanced]:not([hidden])').waitFor();
  const organizedSearchResults = desktopPage.locator('[data-search-result]');
  assert.ok(await organizedSearchResults.count(), '搜索组织基准查询应有结果');
  const searchOrganization = await organizedSearchResults.evaluateAll((items) =>
    items.map((item) => ({
      match: item.getAttribute('data-search-match'),
      type: item.getAttribute('data-search-result-type'),
      startsGroup: item.hasAttribute('data-search-group-start'),
    })),
  );
  const firstDetailMatch = searchOrganization.findIndex(({ match }) => match === 'detail');
  assert.ok(firstDetailMatch > 0, '基准查询应同时覆盖标题命中与详情命中');
  assert.equal(
    searchOrganization.slice(0, firstDetailMatch).every(({ match }) => match === 'title'),
    true,
    '标题命中应稳定先于摘要或关键词命中',
  );
  for (const [index, item] of searchOrganization.entries()) {
    const previous = searchOrganization[index - 1];
    const shouldStartGroup =
      index === 0 || previous.match !== item.match || previous.type !== item.type;
    assert.equal(item.startsGroup, shouldStartGroup, '搜索结果应显式标记稳定类型组边界');
  }
  await desktopPage.locator('[data-search-input]').focus();
  await desktopPage.keyboard.press('ControlOrMeta+A');
  await desktopPage.keyboard.type('演出');
  await desktopPage.keyboard.press('Enter');
  await desktopPage.locator('[data-search-result] a').first().focus();
  assert.equal(
    await desktopPage
      .locator('[data-search-result] a')
      .first()
      .evaluate((element) => element === document.activeElement),
    true,
    '键盘提交后应能继续进入首个搜索结果',
  );
  await desktopPage.locator('[data-search-input]').fill('演');
  await desktopPage.locator('[data-search-input]').press('Enter');
  assert.equal(await desktopPage.locator('[data-search-result]').count(), 0);
  assert.match(
    (await desktopPage.locator('[data-search-feedback]').textContent()) ?? '',
    /2/u,
    '炎语单字查询应显示两字素门槛而不是无结果',
  );
  await desktopPage.goto(`${origin}${archivePath('yan')}`);
  await assertEditorialAlternation(
    desktopPage,
    '.archive-performance-list--home-editorial',
    '.archive-poster',
    '.archive-performance-list__register',
    '1280px 炎国里站首页',
  );
  assert.equal(
    await desktopPage.locator('.archive-performance-list--home-editorial > li').count(),
    buildSnapshot.homepagePerformanceIds.archive.length,
    '里站首页应只装配显式策展集合',
  );
  await desktopPage.goto(`${origin}${archivePath('yan', 'performances')}`);
  assert.equal(
    await desktopPage.locator('.archive-performance-list--home-editorial').count(),
    0,
    '里站完整本季列表不得套用首页编排',
  );
  assert.equal(
    await desktopPage.locator('.archive-performance-list--catalog > li').count(),
    expectedArchiveCurrentCount,
    '里站完整本季列表不得被首页策展集合裁剪',
  );
  const yanLocalization = getLocalization(editions.yan, buildSnapshot);
  const loneWanderPath = archivePath(
    editions.yan.routePrefix,
    'performances/lone-wander-linqu-1084-0719',
  );
  const expectedLoneWanderDescription =
    yanLocalization.programs.productions['lone-wander'].synopsis;
  const loneWanderCard = desktopPage.locator(
    `.archive-performance-list a[href="${loneWanderPath}"]`,
  );
  assert.equal(await loneWanderCard.count(), 1, '里站本季列表应保留独行客场次');
  assert.equal(
    (
      await loneWanderCard
        .locator('.archive-performance-list__register > span > [data-archive-projection-source]')
        .textContent()
    )?.trim(),
    expectedLoneWanderDescription,
    '里站场次列表应显示独行客官方描述，不得回退概念宣传短句',
  );
  await desktopPage.goto(`${origin}${loneWanderPath}`);
  const detailTagline = desktopPage.locator(
    '.archive-detail-header > div > p:not(.eyebrow) > [data-archive-projection-source]',
  );
  assert.equal(
    (await detailTagline.textContent())?.trim(),
    expectedLoneWanderDescription,
    '里站场次详情标题区应显示独行客官方描述',
  );
  await assertNoHorizontalLoss(desktopPage, '1280px 炎国独行客官方描述详情');
  await desktopPage.setViewportSize({ width: 320, height: 800 });
  await assertNoHorizontalLoss(desktopPage, '320px 炎国独行客官方描述详情');
  assertDesktopErrors();
  await desktop.close();

  const archiveVisualContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await archiveVisualContext.addInitScript(() => {
    const stateKey = 'crimson-troupe:archive-pollution:v2';
    if (!sessionStorage.getItem(stateKey)) {
      sessionStorage.setItem(
        stateKey,
        JSON.stringify({ version: 2, level: 0, eventCount: 0, variant: 0 }),
      );
    }
  });
  const archiveVisualPage = await archiveVisualContext.newPage();
  const assertArchiveVisualErrors = trackUnexpectedErrors(archiveVisualPage);
  await archiveVisualPage.goto(`${origin}${archivePath('yan')}`);
  const visualLayer = archiveVisualPage.locator('[data-pollution-visual-layer]');
  await archiveVisualPage.evaluate(() => {
    sessionStorage.setItem(
      'crimson-troupe:archive-pollution:v2',
      JSON.stringify({ version: 2, level: 0, eventCount: 0, variant: 0 }),
    );
  });
  await archiveVisualPage.reload();
  await archiveVisualPage.locator('html[data-pollution-level="0"]').waitFor();
  assert.equal(
    await visualLayer.evaluate((element) => window.getComputedStyle(element).display),
    'none',
    '污染等级 0 不得显示污染框景',
  );
  const compositionTransforms = { 1: new Set(), 2: new Set() };
  for (const level of [1, 2]) {
    for (const composition of [0, 1, 2]) {
      const state = pollutionStateForComposition(level, 'home', archivePath('yan'), composition);
      await archiveVisualPage.evaluate((nextState) => {
        sessionStorage.setItem('crimson-troupe:archive-pollution:v2', JSON.stringify(nextState));
      }, state);
      await archiveVisualPage.reload();
      await archiveVisualPage
        .locator(
          `html[data-pollution-level="${level}"][data-pollution-composition="${composition}"]`,
        )
        .waitFor();
      assert.equal(
        await visualLayer.evaluate((element) => window.getComputedStyle(element).display),
        'block',
        `污染等级 ${level} / 构图 ${composition} 应显示页面框景`,
      );
      assert.equal(
        await archiveVisualPage
          .locator('.archive-pollution-stage__echoes')
          .evaluate((element) => window.getComputedStyle(element).display),
        'none',
        `污染等级 ${level} / 构图 ${composition} 不得提前显示等级 3 文字副本`,
      );
      const stageProof = await visualLayer.evaluate((element) => {
        const proof = window.getComputedStyle(element, '::before');
        return {
          content: proof.content,
          transform: proof.transform,
          width: Number.parseFloat(proof.width),
        };
      });
      assert.notEqual(stageProof.content, 'none', `污染等级 ${level} 应具有档案错版证明`);
      assert.ok(stageProof.width > 100, `污染等级 ${level} 的错版证明应清楚可见`);
      compositionTransforms[level].add(stageProof.transform);
      assert.notEqual(
        await archiveVisualPage
          .locator('[data-pollution-slot="record-list"] > :nth-child(2)')
          .evaluate((element) => window.getComputedStyle(element).boxShadow),
        'none',
        `污染等级 ${level} 应在真实记录列表留下印版痕迹`,
      );
    }
    assert.equal(
      compositionTransforms[level].size,
      3,
      `污染等级 ${level} 应提供三种可辨识且同强度的构图族`,
    );
  }
  for (const duty of [
    {
      pageType: 'performance-list',
      path: archivePath('yan', 'performances'),
      target: '[data-pollution-slot="record-list"]',
    },
    {
      pageType: 'search',
      path: `${archivePath('yan', 'search')}?q=${encodeURIComponent('湖中')}`,
      target: '[data-pollution-slot="search-result"]',
    },
    {
      pageType: 'tickets',
      path: archivePath('yan', 'tickets'),
      target: '[data-pollution-slot="ticket-record"]',
    },
  ]) {
    const state = pollutionStateForComposition(2, duty.pageType, duty.path.split('?')[0], 1);
    await archiveVisualPage.goto(`${origin}${duty.path}`);
    await archiveVisualPage.evaluate((nextLevel) => {
      sessionStorage.setItem('crimson-troupe:archive-pollution:v2', JSON.stringify(nextLevel));
    }, state);
    await archiveVisualPage.reload();
    await archiveVisualPage
      .locator('html[data-pollution-level="2"][data-pollution-composition="1"]')
      .waitFor();
    const dutyTarget = archiveVisualPage.locator(duty.target).first();
    await dutyTarget.waitFor();
    assert.equal(
      await dutyTarget.evaluate((element) => window.getComputedStyle(element).position),
      'relative',
      `${duty.pageType} 应提供真实页面污染作用点`,
    );
    if (duty.pageType === 'performance-list') {
      assert.notEqual(
        await dutyTarget
          .locator(':scope > :first-child')
          .evaluate((element) => window.getComputedStyle(element).transform),
        'none',
        '演出列表应在二级污染中形成记录间空间矛盾',
      );
    } else {
      assert.notEqual(
        await dutyTarget.evaluate((element) => window.getComputedStyle(element).outlineStyle),
        'none',
        `${duty.pageType} 应显示档案错版轮廓`,
      );
    }
  }
  await archiveVisualPage.setViewportSize({ width: 320, height: 800 });
  await assertNoHorizontalLoss(archiveVisualPage, '320px 炎国二级污染静态席位页');
  await archiveVisualPage.setViewportSize({ width: 1280, height: 900 });
  await archiveVisualPage.goto(`${origin}${archivePath('yan')}`);
  const environmentCompositions = new Set();
  for (const composition of [0, 1, 2]) {
    const state = pollutionStateForComposition(3, 'home', archivePath('yan'), composition);
    await archiveVisualPage.evaluate((nextState) => {
      sessionStorage.setItem('crimson-troupe:archive-pollution:v2', JSON.stringify(nextState));
    }, state);
    await archiveVisualPage.reload();
    await archiveVisualPage
      .locator(`html[data-pollution-level="3"][data-pollution-composition="${composition}"]`)
      .waitFor();
    environmentCompositions.add(
      await archiveVisualPage.locator('.archive-pollution-stage').evaluate((element) => {
        const style = window.getComputedStyle(element);
        return `${style.backgroundPosition} / ${style.backgroundSize}`;
      }),
    );
    assert.notEqual(
      await archiveVisualPage
        .locator('main .button')
        .first()
        .evaluate((element) => window.getComputedStyle(element).transform),
      'none',
      `三级污染构图 ${composition} 应让非保护叙事控件参与空间失序`,
    );
    assert.equal(
      await archiveVisualPage
        .locator('.main-nav a, .header-tools summary, .header-tools a, [data-world-switch="front"]')
        .evaluateAll((elements) =>
          elements.every((element) => window.getComputedStyle(element).transform === 'none'),
        ),
      true,
      `三级污染构图 ${composition} 不得扭曲保护能力`,
    );
  }
  assert.equal(environmentCompositions.size, 3, '三级污染应提供三种同强度的页面环境接管构图');
  await archiveVisualPage.evaluate(() => {
    sessionStorage.setItem(
      'crimson-troupe:archive-pollution:v2',
      JSON.stringify({ version: 2, level: 3, eventCount: 8, variant: 2 }),
    );
  });
  for (const edition of builtEditions) {
    await archiveVisualPage.goto(`${origin}${archivePath(edition.routePrefix)}`);
    await archiveVisualPage.locator('html[data-pollution-level="3"]').waitFor();
    const expectedLocalization = getLocalization(edition);
    const expectedProjection = expectedLocalization.archiveProjection.performance;
    const projectedTitles = await archiveVisualPage
      .locator('[data-archive-projection-field="title"]:visible')
      .allTextContents();
    assert.ok(projectedTitles.length, `${edition.editionId} 三级污染首页缺少标题投影`);
    assert.equal(
      projectedTitles.every((title) => title.trim() === expectedProjection.title),
      true,
      `${edition.editionId} 三级污染首页必须使用自身国家版本投影`,
    );
    assert.equal(
      await archiveVisualPage
        .locator('.archive-pollution-stage__echo--venue')
        .textContent()
        .then((value) => value?.trim()),
      expectedProjection.venue,
      `${edition.editionId} 页面环境副本必须使用自身国家版本地点`,
    );
    await assertArchiveVisualLayer(
      archiveVisualPage,
      `1280px ${edition.languageName.zh}三级污染里站`,
    );
    await assertNoHorizontalLoss(
      archiveVisualPage,
      `1280px ${edition.languageName.zh}三级污染里站`,
    );
    await archiveVisualPage.locator('[data-archive-invitation-trigger]').first().click();
    await assertArchiveInvitationArtifact(
      archiveVisualPage,
      expectedLocalization,
      `1280px ${edition.languageName.zh}三级污染请柬`,
    );
    await archiveVisualPage.locator('[data-archive-invitation-close]').first().click();
  }
  assertArchiveVisualErrors();
  await archiveVisualContext.close();

  const archiveAccessContext = await browser.newContext({
    viewport: { width: 768, height: 900 },
    reducedMotion: 'reduce',
  });
  await archiveAccessContext.addInitScript(() => {
    Math.random = () => 0;
    const stateKey = 'crimson-troupe:archive-pollution:v2';
    if (!sessionStorage.getItem(stateKey)) {
      sessionStorage.setItem(
        stateKey,
        JSON.stringify({ version: 2, level: 0, eventCount: 1, variant: 0 }),
      );
    }
  });
  const archiveAccessPage = await archiveAccessContext.newPage();
  const assertArchiveAccessErrors = trackUnexpectedErrors(archiveAccessPage);
  await archiveAccessPage.goto(`${origin}${archivePath('yan', 'search')}`);
  const pollutionStatus = archiveAccessPage.locator('[data-pollution-status]');
  assert.equal((await pollutionStatus.textContent())?.trim(), '', '初始加载不得朗读污染或请柬');
  await archiveAccessPage.evaluate(() => {
    const status = document.querySelector('[data-pollution-status]');
    window.__pollutionStatusMutations = 0;
    new window.MutationObserver(() => {
      window.__pollutionStatusMutations += 1;
    }).observe(status, { childList: true });
  });
  const accessSearch = archiveAccessPage.locator('[data-search-input]');
  const initialSearchEventCount = await archiveAccessPage.evaluate(
    () => JSON.parse(sessionStorage.getItem('crimson-troupe:archive-pollution:v2')).eventCount,
  );
  await accessSearch.fill('湖');
  await accessSearch.press('Enter');
  assert.equal(
    await archiveAccessPage.evaluate(
      () => JSON.parse(sessionStorage.getItem('crimson-troupe:archive-pollution:v2')).eventCount,
    ),
    initialSearchEventCount,
    '里站过短查询不得消耗污染事件',
  );
  await accessSearch.fill('湖中');
  await accessSearch.press('Enter');
  await archiveAccessPage.locator('html[data-pollution-level="1"]').waitFor();
  assert.equal(
    (await pollutionStatus.textContent())?.trim(),
    getLocalization(editions.yan, buildSnapshot).archiveProjection.statusAnnouncements[0],
    '等级变化应使用当前国家版本的短公告',
  );
  await archiveAccessPage.evaluate(() => {
    Math.random = () => 1;
  });
  await accessSearch.press('Enter');
  assert.equal(
    await archiveAccessPage.evaluate(() => window.__pollutionStatusMutations),
    1,
    '同一等级内的后续动作不得重复公告',
  );

  await archiveAccessPage.evaluate(() => {
    sessionStorage.setItem(
      'crimson-troupe:archive-pollution:v2',
      JSON.stringify({ version: 2, level: 3, eventCount: 8, variant: 1 }),
    );
  });
  await archiveAccessPage.goto(`${origin}${archivePath('yan')}`);
  await archiveAccessPage.locator('html[data-pollution-level="3"]').waitFor();
  assert.equal(
    (await archiveAccessPage.locator('[data-pollution-status]').textContent())?.trim(),
    '',
    '读取既有等级 3 状态时不得把请柬作为初始公告',
  );
  await assertNoHorizontalLoss(archiveAccessPage, '768px 炎国三级污染里站');
  await assertControlsWithinViewport(
    archiveAccessPage,
    '[data-pollution-safe] a, [data-pollution-safe] button, [data-pollution-safe] summary',
    '768px 炎国三级污染里站',
  );
  const accessInvitationTrigger = archiveAccessPage
    .locator('a[data-archive-invitation-trigger]')
    .first();
  const accessInvitationTarget = await accessInvitationTrigger.getAttribute('href');
  assert.ok(accessInvitationTarget, '768px 邀请触发器应保留合法链接');
  await accessInvitationTrigger.focus();
  await archiveAccessPage.keyboard.press('Enter');
  await archiveAccessPage.locator('[data-archive-invitation][open]').waitFor();
  await assertControlsWithinViewport(
    archiveAccessPage,
    '[data-archive-invitation][open] button',
    '768px 炎国三级污染请柬',
  );
  await archiveAccessPage.keyboard.press('Escape');
  assert.equal(
    await accessInvitationTrigger.evaluate((element) => element === document.activeElement),
    true,
    'Escape 关闭邀请后焦点应返回原触发器',
  );
  await archiveAccessPage.keyboard.press('Enter');
  await archiveAccessPage.locator('[data-archive-invitation][open]').waitFor();
  const accessContinue = archiveAccessPage.locator('[data-archive-invitation-continue]');
  await accessContinue.focus();
  await archiveAccessPage.keyboard.press('Enter');
  await archiveAccessPage.waitForURL(new URL(accessInvitationTarget, origin).href);
  assertArchiveAccessErrors();
  await archiveAccessContext.close();

  const ticketContext = await browser.newContext({ viewport: { width: 320, height: 800 } });
  await ticketContext.addInitScript(() => {
    Math.random = () => 0.1;
  });
  const ticketPage = await ticketContext.newPage();
  const assertTicketErrors = trackUnexpectedErrors(ticketPage);
  await ticketPage.goto(`${origin}/yan/tickets/`);
  await ticketPage.locator('[data-ticketing-app]:not([hidden])').waitFor();
  await assertNoHorizontalLoss(ticketPage, '320px 炎国票务');
  const seatingPlans = [
    { id: 'trimount-grand-fan', levels: 3, zones: ['C', 'B', 'A', 'S', 'BOX'] },
    { id: 'wiesheim-mirror-horseshoe', levels: 3, zones: ['C', 'B', 'A', 'S', 'BOX'] },
    { id: 'norport-temporary-stand', levels: 1, zones: ['C', 'B', 'A'] },
    { id: 'montelupe-banquet-horseshoe', levels: 2, zones: ['C', 'B', 'A', 'S', 'BOX'] },
    { id: 'linqu-courtyard-fan', levels: 1, zones: ['C', 'B', 'A', 'S'] },
    { id: 'londinium-grand-tiers', levels: 3, zones: ['C', 'B', 'A', 'S', 'BOX'] },
    { id: 'qingsui-opera-courtyard', levels: 3, zones: ['C', 'B', 'A', 'S'] },
  ];
  for (const expected of seatingPlans) {
    const details = ticketPage.locator(`[data-seating-plan="${expected.id}"]`);
    assert.equal(await details.count(), 1, `${expected.id} 应且只应出现一次`);
    await details.locator('summary').click();
    assert.equal(
      await details.locator('[data-seating-level]').count(),
      expected.levels,
      `${expected.id} 的楼层数量不正确`,
    );
    const selectorZones = await details
      .locator('xpath=ancestor::li[1]')
      .locator('[data-ticket-zone] option')
      .evaluateAll((options) => options.map((option) => option.value));
    const mapZones = await details
      .locator('[data-ticket-zone-map]')
      .evaluateAll((buttons) => [
        ...new Set(buttons.map((button) => button.dataset.ticketZoneMap)),
      ]);
    assert.deepEqual(selectorZones, expected.zones, `${expected.id} 的表单分区不正确`);
    assert.deepEqual(
      mapZones.sort(),
      [...expected.zones].sort(),
      `${expected.id} 的图形分区不正确`,
    );
    const levelBoxes = await details
      .locator('[data-seating-level]')
      .evaluateAll((levels) => levels.map((level) => level.getBoundingClientRect().toJSON()));
    assert.ok(
      levelBoxes.every((box) => box.width > 0 && box.height > 0),
      `${expected.id} 的楼层示意不可见`,
    );
    for (let first = 0; first < levelBoxes.length; first += 1) {
      for (let second = first + 1; second < levelBoxes.length; second += 1) {
        const a = levelBoxes[first];
        const b = levelBoxes[second];
        const overlaps =
          a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
        assert.equal(overlaps, false, `${expected.id} 的楼层示意发生重叠`);
      }
    }
    const overlappingControls = await details
      .locator('[data-seating-level]')
      .evaluateAll((levels) =>
        levels.flatMap((level) => {
          const controls = [...level.querySelectorAll('[data-ticket-zone-map]')].map((control) => ({
            region: control.getAttribute('data-seating-region-control'),
            bounds: control.getBoundingClientRect().toJSON(),
          }));
          return controls.flatMap((first, firstIndex) =>
            controls.slice(firstIndex + 1).flatMap((second) => {
              const overlaps =
                first.bounds.left < second.bounds.right - 1 &&
                first.bounds.right > second.bounds.left + 1 &&
                first.bounds.top < second.bounds.bottom - 1 &&
                first.bounds.bottom > second.bounds.top + 1;
              return overlaps
                ? [{ level: level.getAttribute('data-seating-level'), first, second }]
                : [];
            }),
          );
        }),
      );
    assert.deepEqual(
      overlappingControls,
      [],
      `${expected.id} 的分区标签发生重叠：${JSON.stringify(overlappingControls)}`,
    );
    await assertNoHorizontalLoss(ticketPage, `320px ${expected.id} 分区示意`);
  }
  const ticketRows = ticketPage.locator('[data-ticket-option]');
  assert.deepEqual(
    await ticketRows.evaluateAll((rows) => rows.map((row) => row.dataset.ticketOption)),
    buildSnapshot.homepagePerformanceIds.front,
    '票务页场次应与表站首页策展顺序一致',
  );
  const firstTicketRow = ticketPage.locator('[data-ticket-option="uncrowned-trimount-1102"]');
  const firstTicketSelect = firstTicketRow.locator('[data-ticket-zone]');
  const firstTicketCheckbox = firstTicketRow.locator('[data-ticket-select]');
  const firstTicketMap = firstTicketRow.locator('[data-ticket-seating-map]');
  const ticketStart = ticketPage.locator('[data-ticket-start]');
  const ticketTotal = ticketPage.locator('[data-ticket-base-total]');
  assert.equal(
    await ticketRows.locator('[data-ticket-zone]:disabled').count(),
    0,
    '未加入票篮时所有分区选择器仍应可用',
  );
  assert.equal(await ticketRows.locator('[data-ticket-select]:checked').count(), 0);
  assert.equal(await ticketStart.isDisabled(), true, '空票篮不得提交');
  assert.equal(await firstTicketSelect.inputValue(), 'C', '场次应具有有效默认预选分区');
  assert.equal(await firstTicketMap.getAttribute('data-selected-zone'), 'C');

  await firstTicketRow.locator('[data-ticket-seating-details] summary').click();
  const boxZoneButton = firstTicketMap.locator('[data-ticket-zone-map="BOX"]').first();
  await boxZoneButton.focus();
  await ticketPage.keyboard.press('Enter');
  assert.equal(await firstTicketCheckbox.isChecked(), false, '图形预选不得隐式加入票篮');
  assert.equal(await firstTicketSelect.inputValue(), 'BOX');
  assert.equal(await firstTicketMap.getAttribute('data-selected-zone'), 'BOX');
  assert.equal(await ticketTotal.textContent(), '0 LMD');
  assert.equal(await ticketStart.isDisabled(), true);
  assert.match(
    (await firstTicketRow.locator('[data-ticket-zone-feedback]').textContent()) ?? '',
    /包厢.*1680 LMD.*尚未加入票篮/u,
  );

  await firstTicketCheckbox.check();
  assert.equal(await firstTicketSelect.inputValue(), 'BOX', '入篮应沿用当前预选分区');
  assert.equal(await ticketTotal.textContent(), '1680 LMD');
  await firstTicketSelect.selectOption('C');
  assert.equal(await firstTicketMap.getAttribute('data-selected-zone'), 'C');
  assert.equal(await ticketTotal.textContent(), '260 LMD', '下拉改区应同步票篮报价');
  await firstTicketMap.locator('[data-ticket-zone-map="A"]').first().click();
  assert.equal(await firstTicketSelect.inputValue(), 'A');
  assert.equal(await ticketTotal.textContent(), '680 LMD', '图形改区应同步票篮报价');
  await firstTicketCheckbox.uncheck();
  assert.equal(await firstTicketSelect.inputValue(), 'A', '移出票篮不得重置页面预选');
  assert.equal(await firstTicketMap.getAttribute('data-selected-zone'), 'A');
  assert.equal(await ticketTotal.textContent(), '0 LMD');
  assert.equal(await ticketStart.isDisabled(), true);

  await firstTicketCheckbox.check();
  await ticketPage.locator('[data-ticket-start]').click();
  await ticketPage.waitForURL(`${origin}/yan/tickets/partner/`);
  const partnerDialog = ticketPage.locator('[data-partner-dialog][open]');
  await partnerDialog.waitFor();
  assert.equal(
    await ticketPage
      .locator('[data-partner-title]')
      .evaluate((element) => element === document.activeElement),
    true,
  );
  assert.equal(
    await partnerDialog
      .locator('[data-partner-brand="rice-network"] [data-ticketing-platform]')
      .count(),
    1,
  );
  await ticketPage.locator('[data-partner-action="receipt"]').click();
  await ticketPage.locator('[data-ticket-result]:not([hidden])').waitFor();
  assert.equal(new URL(ticketPage.url()).pathname, '/yan/tickets/partner/');
  assert.equal(
    await ticketPage
      .locator('#ticket-receipt-title')
      .evaluate((element) => element === document.activeElement),
    true,
  );
  assert.equal(await ticketPage.locator('[data-ticket-journey]').count(), 0);
  assert.equal(await ticketPage.locator('[data-ticket-stamp-inspector]').count(), 0);
  assert.equal(await ticketPage.locator('[data-ticket-finish-workshop]').count(), 0);
  assert.equal(await ticketPage.locator('input[data-ticket-finish]').count(), 0);
  assert.equal(await ticketPage.locator('[data-ticket-action^="download:"]').isEnabled(), true);
  const ticketImage = ticketPage.locator('.issued-ticket > img');
  const ticketSource = await ticketImage.getAttribute('src');
  assert.match(ticketSource ?? '', /^data:image\/svg\+xml/u);
  const decodedTicketSource = decodeURIComponent((ticketSource ?? '').split(',', 2)[1] ?? '');
  const ticketImageSize = await ticketImage.evaluate(async (image) => {
    await image.decode();
    return { width: image.naturalWidth, height: image.naturalHeight };
  });
  assert.deepEqual(ticketImageSize, { width: 1200, height: 540 });
  const ticketParserError = await ticketPage.evaluate((source) => {
    const document_ = new globalThis.DOMParser().parseFromString(source, 'image/svg+xml');
    return document_.querySelector('parsererror')?.textContent ?? null;
  }, decodedTicketSource);
  assert.equal(ticketParserError, null, '纪念票 SVG 应通过独立 XML 解析');
  assert.match(decodedTicketSource, /data-ticket-field="title"/u);
  assert.match(decodedTicketSource, /data-ticket-language="primary" lang="en-US"/u);
  assert.match(decodedTicketSource, /data-ticket-language="secondary" lang="zh-CN"/u);
  assert.match(decodedTicketSource, /data-ticket-field-group="production"/u);
  assert.match(decodedTicketSource, /data-ticket-field-group="date-time"/u);
  assert.match(decodedTicketSource, /data-ticket-field-group="venue"/u);
  assert.match(decodedTicketSource, /data-ticket-field-group="zone"/u);
  const downloadedFieldOrder = [
    'data-ticket-field="title"',
    'data-ticket-field="secondary-title"',
    'data-ticket-field="kind"',
    'data-ticket-field="date-time"',
    'data-ticket-field="secondary-date-time"',
    'data-ticket-field="place"',
    'data-ticket-field="secondary-place"',
  ].map((field) => decodedTicketSource.indexOf(field));
  assert.ok(downloadedFieldOrder.every((index) => index >= 0));
  assert.deepEqual(
    [...downloadedFieldOrder].sort((left, right) => left - right),
    downloadedFieldOrder,
  );
  assert.match(decodedTicketSource, /data-ticket-composite-stamp=""/u);
  assert.match(decodedTicketSource, /data-ticket-finish="ticket-punch"/u);
  assert.match(decodedTicketSource, /<g data-ticket-finish="ticket-punch"/u);
  const screenFieldGroups = await ticketPage
    .locator('.issued-ticket__caption [data-ticket-field-group]')
    .evaluateAll((elements) =>
      elements.map((element) => element.getAttribute('data-ticket-field-group')),
    );
  assert.deepEqual(screenFieldGroups, ['production', 'date-time', 'venue']);
  assert.match(
    (await ticketPage
      .locator('.issued-ticket__caption [data-ticket-field-group="production"]')
      .textContent()) ?? '',
    /The Uncrowned Night.*无冕之夜.*Modern Tragedy/su,
  );
  assert.match(
    (await ticketPage
      .locator('.issued-ticket__caption [data-ticket-field-group="date-time"]')
      .textContent()) ?? '',
    /September 17, 1102 at 7:30 PM.*1102年9月17日 19:30/su,
  );
  assert.match(
    (await ticketPage
      .locator('.issued-ticket__caption [data-ticket-field-group="venue"]')
      .textContent()) ?? '',
    /Trimounts Grand Theater · Main Stage.*特里蒙大剧院 · 主舞台/su,
  );
  assert.match((await ticketPage.locator('.issued-ticket__number').textContent()) ?? '', /^票号 /u);
  assert.equal(
    await ticketPage.locator('[data-ticket-receipt] .ticket-receipt__lines li').count(),
    1,
  );
  assert.equal(
    await ticketPage.locator('[data-ticket-receipt] .ticket-receipt__meta > div').count(),
    3,
  );
  assert.match(
    (await ticketPage.locator('[data-ticket-receipt] .ticket-receipt__meta').textContent()) ?? '',
    /受理时间.*1102.*配发渠道.*STANDARD CHANNEL.*受理状态.*席位已配发/su,
  );
  assert.equal(
    await ticketPage.locator('[data-ticket-receipt] .ticket-receipt__line-details > div').count(),
    4,
  );
  assert.equal(
    await ticketPage.locator('[data-ticket-receipt] .ticket-receipt__totals > div').count(),
    2,
    '普通成功只显示票款小计与应付合计',
  );
  assert.equal(await ticketPage.locator('[data-ticket-receipt] > small').count(), 1);
  const mobileTicketLayout = await ticketPage.locator('.issued-ticket').evaluate((article) => {
    const image = article.querySelector(':scope > img');
    const caption = article.querySelector('.issued-ticket__caption');
    if (!image || !caption) {
      return null;
    }
    const articleRect = article.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    const captionRect = caption.getBoundingClientRect();
    return {
      articleWidth: articleRect.width,
      imageWidth: imageRect.width,
      imageBottom: imageRect.bottom,
      captionTop: captionRect.top,
    };
  });
  assert.ok(mobileTicketLayout, '窄屏纪念票应包含票面和下方信息区');
  assert.ok(
    Math.abs(mobileTicketLayout.articleWidth - mobileTicketLayout.imageWidth) <= 2,
    '窄屏票面应占满票券卡片宽度',
  );
  assert.ok(
    mobileTicketLayout.captionTop >= mobileTicketLayout.imageBottom,
    '窄屏购票信息应排在完整票面下方',
  );
  await assertNoHorizontalLoss(ticketPage, '320px 炎国票务结果');
  await ticketPage.reload();
  await ticketPage.locator('[data-ticket-result]:not([hidden])').waitFor();
  assert.equal(await ticketPage.locator('[data-ticket-finish-workshop]').count(), 0);
  await ticketPage.emulateMedia({ reducedMotion: 'reduce' });
  await ticketPage.setViewportSize({ width: 1280, height: 900 });
  await assertNoHorizontalLoss(ticketPage, '1280px 炎国票务结果');
  const desktopTicketLayout = await ticketPage.locator('.issued-ticket').evaluate((article) => {
    const image = article.querySelector(':scope > img');
    const caption = article.querySelector('.issued-ticket__caption');
    if (!image || !caption) {
      return null;
    }
    const articleRect = article.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    const captionRect = caption.getBoundingClientRect();
    return {
      articleWidth: articleRect.width,
      imageWidth: imageRect.width,
      imageBottom: imageRect.bottom,
      captionTop: captionRect.top,
    };
  });
  assert.ok(desktopTicketLayout, '桌面纪念票应包含票面和下方信息区');
  assert.ok(
    Math.abs(desktopTicketLayout.articleWidth - desktopTicketLayout.imageWidth) <= 2,
    '桌面票面应占满票券卡片宽度',
  );
  assert.ok(
    desktopTicketLayout.captionTop >= desktopTicketLayout.imageBottom,
    '桌面购票信息应排在完整票面下方',
  );
  await ticketPage.locator('[data-ticket-new-round]').click();
  await ticketPage.waitForURL(`${origin}/yan/tickets/`);
  await ticketPage.goto(`${origin}/yan/tickets/partner/`);
  const partnerBrand = ticketPage.locator('[data-ticketing-platform="rice-network"]:has(h1)');
  await partnerBrand.waitFor();
  assert.equal(await partnerBrand.locator('h1').textContent(), '水稻网');
  assert.equal(await partnerBrand.locator('img').first().getAttribute('alt'), '水稻网临时标识');
  assert.equal(
    await ticketPage.locator('.partner-ticketing__fallback a').getAttribute('href'),
    '/yan/tickets/',
  );
  await assertNoHorizontalLoss(ticketPage, '320px 炎国水稻网页面');
  assertTicketErrors();
  await ticketContext.close();

  const partnerBranchContext = await browser.newContext({ viewport: { width: 320, height: 800 } });
  await partnerBranchContext.addInitScript(() => {
    Math.random = () => 0.5;
  });
  const partnerBranchPage = await partnerBranchContext.newPage();
  const assertPartnerBranchErrors = trackUnexpectedErrors(partnerBranchPage);
  await partnerBranchPage.goto(`${origin}/yan/tickets/`);
  await partnerBranchPage.locator('[data-ticketing-app]:not([hidden])').waitFor();
  await partnerBranchPage.locator('[data-ticket-select]').first().check();
  await partnerBranchPage.locator('[data-ticket-start]').click();
  await partnerBranchPage.waitForURL(`${origin}/yan/tickets/partner/`);
  const branchDialog = partnerBranchPage.locator('[data-partner-dialog][open]');
  await branchDialog.waitFor();
  const standardRetry = branchDialog.locator('[data-partner-action="retry"]');
  const premiumOfferAction = branchDialog.locator('[data-partner-action="offer"]');
  const returnToBasket = branchDialog.locator('[data-partner-action="back"]');
  assert.match((await standardRetry.textContent()) ?? '', /水稻网.*原价/u);
  assert.match((await premiumOfferAction.textContent()) ?? '', /跳楼机.*加价/u);
  assert.match((await returnToBasket.textContent()) ?? '', /官网.*票篮/u);
  assert.equal(await standardRetry.getAttribute('class'), 'button');
  assert.equal(await premiumOfferAction.getAttribute('class'), 'button');
  const [retryBox, offerBox] = await Promise.all([
    standardRetry.boundingBox(),
    premiumOfferAction.boundingBox(),
  ]);
  assert.ok(retryBox && offerBox, '标准重试与加价方案控件应可见');
  assert.ok(
    Math.abs(retryBox.height - offerBox.height) <= 1,
    '标准重试与加价方案控件应保持同等视觉高度',
  );
  await partnerBranchPage.locator('[data-partner-action="offer"]').click();
  await branchDialog.waitFor();
  assert.equal(
    await partnerBranchPage.locator('[data-partner-action="accept-premium"]').count(),
    1,
    '查看跳楼机方案后仍须由访客明确接受',
  );
  assert.equal(
    await partnerBranchPage.locator('[data-ticket-result]:not([hidden])').count(),
    0,
    '查看方案不得直接产生购票结果',
  );
  assert.equal(
    await partnerBranchPage
      .locator(
        '[data-partner-brand="drop-tower"]:not([hidden]) [data-ticketing-platform="drop-tower"]',
      )
      .count(),
    1,
  );
  await partnerBranchPage.keyboard.press('Escape');
  const reviewPartnerResult = partnerBranchPage.locator('[data-partner-review]:not([hidden])');
  await reviewPartnerResult.waitFor();
  assert.equal(
    await reviewPartnerResult.evaluate((element) => element === document.activeElement),
    true,
    'Escape 关闭第三方提示后焦点应回到复核按钮',
  );
  await reviewPartnerResult.click();
  await partnerBranchPage.locator('[data-partner-action="decline-premium"]').click();
  assert.equal(
    await partnerBranchPage.locator('[data-partner-brand="drop-tower"]:not([hidden])').isVisible(),
    true,
  );
  await partnerBranchPage.locator('[data-partner-action="decline-retention"]').click();
  await partnerBranchPage.waitForURL(`${origin}/yan/tickets/`);
  await assertNoHorizontalLoss(partnerBranchPage, '320px 跳楼机邀请与挽留路径');
  assertPartnerBranchErrors();
  await partnerBranchContext.close();

  for (const priorityPath of ['full', 'retention']) {
    const priorityContext = await browser.newContext({ viewport: { width: 320, height: 800 } });
    await priorityContext.addInitScript(() => {
      Math.random = () => 0.5;
    });
    const priorityPage = await priorityContext.newPage();
    const assertPriorityErrors = trackUnexpectedErrors(priorityPage);
    await priorityPage.goto(`${origin}/yan/tickets/`);
    await priorityPage.locator('[data-ticketing-app]:not([hidden])').waitFor();
    await priorityPage.locator('[data-ticket-select]').first().check();
    await priorityPage.locator('[data-ticket-start]').click();
    await priorityPage.waitForURL(`${origin}/yan/tickets/partner/`);
    await priorityPage.locator('[data-partner-dialog][open]').waitFor();
    await priorityPage.locator('[data-partner-action="offer"]').click();
    if (priorityPath === 'retention') {
      await priorityPage.locator('[data-partner-action="decline-premium"]').click();
      await priorityPage.locator('[data-partner-action="accept-retention"]').click();
    } else {
      await priorityPage.locator('[data-partner-action="accept-premium"]').click();
    }
    await priorityPage.locator('[data-partner-dialog][open]').waitFor();
    await priorityPage.locator('[data-partner-action="receipt"]').click();
    await priorityPage.locator('[data-ticket-result]:not([hidden])').waitFor();
    const priorityTotals = priorityPage.locator('[data-ticket-receipt] .ticket-receipt__totals');
    assert.match((await priorityTotals.textContent()) ?? '', /优先席位调度服务.*\+/su);
    if (priorityPath === 'retention') {
      assert.equal(await priorityTotals.locator(':scope > div').count(), 4);
      assert.match((await priorityTotals.textContent()) ?? '', /即时确认减让.*−/su);
    } else {
      assert.equal(await priorityTotals.locator(':scope > div').count(), 3);
      assert.doesNotMatch((await priorityTotals.textContent()) ?? '', /即时确认减让/u);
    }
    await assertNoHorizontalLoss(priorityPage, `320px ${priorityPath} 优先线路凭单`);
    assertPriorityErrors();
    await priorityContext.close();
  }

  const minosContext = await browser.newContext({
    viewport: { width: 320, height: 800 },
    acceptDownloads: true,
  });
  await minosContext.addInitScript(() => {
    Math.random = () => 0.1;
    window.print = () => {
      document.documentElement.dataset.printCalled = 'true';
      window.setTimeout(() => window.dispatchEvent(new Event('afterprint')), 0);
    };
  });
  const minosPage = await minosContext.newPage();
  const assertMinosErrors = trackUnexpectedErrors(minosPage);
  await minosPage.goto(`${origin}/min/search/?q=παράσταση`);
  await minosPage.locator('[data-search-enhanced]:not([hidden])').waitFor();
  assert.ok(await minosPage.locator('[data-search-results] li').count(), '米诺斯语查询应有结果');
  await assertNoHorizontalLoss(minosPage, '320px 米诺斯语搜索');
  await minosPage.goto(`${origin}/min/tickets/`);
  await minosPage.locator('[data-ticketing-app]:not([hidden])').waitFor();
  await minosPage.locator('[data-ticket-select]').first().check();
  await minosPage.locator('[data-ticket-start]').click();
  await minosPage.waitForURL(`${origin}/min/tickets/partner/`);
  await minosPage.locator('[data-partner-dialog][open]').waitFor();
  await minosPage.locator('[data-partner-action="receipt"]').click();
  await minosPage.locator('[data-ticket-result]:not([hidden])').waitFor();
  assert.equal(new URL(minosPage.url()).pathname, '/min/tickets/partner/');
  const minosTicketSource = await minosPage.locator('.issued-ticket > img').getAttribute('src');
  assert.match(decodeURIComponent(minosTicketSource ?? ''), /\p{Script=Greek}/u);
  assert.match(decodeURIComponent(minosTicketSource ?? ''), /data-ticket-finish="ticket-punch"/u);
  const downloadPromise = minosPage.waitForEvent('download');
  await minosPage.locator('[data-ticket-action^="download:"]').click();
  const download = await downloadPromise;
  assert.match(download.suggestedFilename(), /^crimson-troupe-.+\.svg$/u);
  await minosPage.locator('[data-ticket-action^="print:"]').click();
  await minosPage.locator('html[data-print-called="true"]').waitFor();
  await minosPage.locator('body:not(.is-printing-ticket)').waitFor();
  await assertNoHorizontalLoss(minosPage, '320px 米诺斯语票务结果');
  const minosSelector = minosPage.locator('[data-edition-selector]');
  await minosSelector.locator('summary').click();
  await minosSelector.locator('a[lang="zh-CN"]').click();
  await minosPage.locator('[data-ticket-result]:not([hidden])').waitFor();
  assert.match(new URL(minosPage.url()).pathname, /^\/yan\/tickets\/partner\/$/u);
  assert.equal(await minosPage.locator('[data-ticket-finish-workshop]').count(), 0);
  assertMinosErrors();
  await minosContext.close();

  for (const [routePrefix, label] of [
    ['hig', '东国语'],
    ['min', '米诺斯语'],
    ['urs', '乌萨斯语'],
  ]) {
    const headerContext = await browser.newContext({ viewport: { width: 320, height: 800 } });
    const headerPage = await headerContext.newPage();
    const assertHeaderErrors = trackUnexpectedErrors(headerPage);
    await headerPage.goto(`${origin}/${routePrefix}/`);
    await headerPage.locator('h1').waitFor();
    await assertNoHorizontalLoss(headerPage, `320px ${label}表站首页`);
    if (routePrefix === 'hig') {
      await assertEditorialMobileOrder(
        headerPage,
        '.front-performance-grid--home-editorial',
        '.production-visual',
        '.front-performance-card__copy',
        '320px 东国语表站首页',
      );
      const editionSelector = headerPage.locator('[data-edition-selector]');
      await editionSelector.locator('summary').click();
      const optionStyles = await editionSelector.locator('a').evaluateAll((links) =>
        Object.fromEntries(
          links.map((link) => [
            link.lang,
            {
              fontFamily: window.getComputedStyle(link).fontFamily,
              letterSpacing: window.getComputedStyle(link).letterSpacing,
            },
          ]),
        ),
      );
      for (const locale of ['en-US', 'en-GB', 'it', 'de', 'pl', 'el', 'ru']) {
        assert.match(optionStyles[locale].fontFamily, /Arial|Noto Sans|DejaVu Sans/u);
        assert.doesNotMatch(optionStyles[locale].fontFamily, /Yu Gothic|Hiragino/u);
        assert.equal(optionStyles[locale].letterSpacing, 'normal');
      }
      await headerPage.goto(`${origin}${archivePath('hig')}`);
      await assertEditorialMobileOrder(
        headerPage,
        '.archive-performance-list--home-editorial',
        '.archive-poster',
        '.archive-performance-list__register',
        '320px 东国语里站首页',
      );
      await assertNoHorizontalLoss(headerPage, '320px 东国语里站首页');
    }
    assertHeaderErrors();
    await headerContext.close();
  }

  const ursusContext = await browser.newContext({
    viewport: { width: 320, height: 800 },
    acceptDownloads: true,
    reducedMotion: 'reduce',
  });
  await ursusContext.addInitScript(() => {
    Math.random = () => 0.1;
  });
  const ursusPage = await ursusContext.newPage();
  const assertUrsusErrors = trackUnexpectedErrors(ursusPage);
  await ursusPage.goto(`${origin}/urs/search/?q=спектакль`);
  await ursusPage.locator('[data-search-enhanced]:not([hidden])').waitFor();
  const ursusFrontResults = ursusPage.locator('[data-search-results] a');
  assert.ok(await ursusFrontResults.count(), '乌萨斯语表站查询应有结果');
  assert.equal(
    await ursusFrontResults.evaluateAll((links) =>
      links.every((link) => new URL(link.href).pathname.startsWith('/urs/')),
    ),
    true,
    '乌萨斯语表站搜索不得越过国家版本',
  );
  await assertNoHorizontalLoss(ursusPage, '320px 乌萨斯语搜索');
  await ursusPage.goto(`${origin}/urs/tickets/`);
  await ursusPage.locator('[data-ticketing-app]:not([hidden])').waitFor();
  await ursusPage.locator('[data-ticket-select]').first().check();
  await ursusPage.locator('[data-ticket-start]').click();
  await ursusPage.waitForURL(`${origin}/urs/tickets/partner/`);
  await ursusPage.locator('[data-partner-dialog][open]').waitFor();
  await ursusPage.locator('[data-partner-action="receipt"]').click();
  await ursusPage.locator('[data-ticket-result]:not([hidden])').waitFor();
  const editionRouteSequence = builtEditions.map(({ routePrefix }) => routePrefix);
  for (const routePrefix of editionRouteSequence) {
    const editionSelector = ursusPage.locator('[data-edition-selector]');
    await editionSelector.locator('summary').click();
    await editionSelector.locator(`a[href^="/${routePrefix}/tickets/"]`).click();
    await ursusPage.locator('[data-ticket-result]:not([hidden])').waitFor();
    assert.match(
      new URL(ursusPage.url()).pathname,
      new RegExp(`^/${routePrefix}/tickets/partner/$`, 'u'),
    );
  }
  const returnToUrsusSelector = ursusPage.locator('[data-edition-selector]');
  await returnToUrsusSelector.locator('summary').click();
  await returnToUrsusSelector.locator('a[href^="/urs/tickets/"]').click();
  await ursusPage.locator('[data-ticket-result]:not([hidden])').waitFor();
  const ursusTicketSource = await ursusPage.locator('.issued-ticket > img').getAttribute('src');
  assert.match(decodeURIComponent(ursusTicketSource ?? ''), /\p{Script=Cyrillic}/u);
  assert.match(decodeURIComponent(ursusTicketSource ?? ''), /data-ticket-finish="ticket-punch"/u);
  const ursusDownloadPromise = ursusPage.waitForEvent('download');
  await ursusPage.locator('[data-ticket-action^="download:"]').click();
  const ursusDownload = await ursusDownloadPromise;
  assert.match(ursusDownload.suggestedFilename(), /^crimson-troupe-.+\.svg$/u);
  await assertNoHorizontalLoss(ursusPage, '320px 乌萨斯语票务结果');
  await ursusPage.goto(`${origin}${archivePath('urs', 'search')}?q=спектакль`);
  await ursusPage.locator('[data-search-enhanced]:not([hidden])').waitFor();
  const ursusArchiveResults = ursusPage.locator('[data-search-results] a');
  assert.ok(await ursusArchiveResults.count(), '乌萨斯语里站查询应有结果');
  const ursusArchiveRoot = archivePath('urs');
  assert.equal(
    await ursusArchiveResults.evaluateAll(
      (links, root) => links.every((link) => new URL(link.href).pathname.startsWith(root)),
      ursusArchiveRoot,
    ),
    true,
    '乌萨斯语里站搜索不得越过时间层',
  );
  await ursusPage.evaluate(() => {
    sessionStorage.setItem(
      'crimson-troupe:archive-pollution:v2',
      JSON.stringify({ version: 2, level: 3, eventCount: 8, variant: 1 }),
    );
  });
  await ursusPage.goto(`${origin}${archivePath('urs')}`);
  await ursusPage.locator('html[data-pollution-level="3"]').waitFor();
  await assertNoHorizontalLoss(ursusPage, '320px 乌萨斯语三级污染里站');
  await ursusPage.locator('[data-world-switch="front"]').click();
  await ursusPage.locator('html[data-world="front"]').waitFor();
  assert.match(new URL(ursusPage.url()).pathname, /^\/urs\/$/u);
  assertUrsusErrors();
  await ursusContext.close();

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
  await archivePage.goto(`${origin}/yan/archive/site/1084/`);
  await archivePage.waitForURL(
    `${origin}/yan/archive/site/${currentArchiveSnapshot.routeSegment}/`,
  );
  await archivePage.locator('html[data-pollution-level="3"]').waitFor();
  await assertArchiveVisualLayer(archivePage, '320px 炎国三级污染里站', true);
  await assertArchiveProjectionList(archivePage, expectedArchiveCurrentCount, '三级污染里站首页');
  await archivePage.goto(`${origin}${archivePath('yan', 'performances')}`);
  await assertArchiveProjectionList(
    archivePage,
    expectedArchiveCurrentCount,
    '三级污染里站本季演出',
  );
  assert.notEqual(
    await archivePage
      .locator('[data-pollution-slot="record-list"] > :first-child')
      .evaluate((element) => window.getComputedStyle(element).transform),
    'none',
    '三级污染演出列表应形成记录间空间失序',
  );
  await archivePage.goto(`${origin}${archivePath('yan', 'performances/history')}`);
  await assertArchiveProjectionList(
    archivePage,
    expectedArchiveHistoryCount,
    '三级污染里站历史演出',
  );
  const archivePerformanceTarget = await archivePage
    .locator('.archive-performance-list > li > a')
    .first()
    .getAttribute('href');
  assert.ok(archivePerformanceTarget, '历史演出应保留可访问的原场次链接');
  await archivePage.goto(new URL(archivePerformanceTarget, origin).href);
  assert.equal(
    await archivePage.locator('h1 [data-archive-projection-field="title"]:visible').count(),
    1,
    '场次详情 H1 应显示职责化投影标题',
  );
  assert.equal(
    await archivePage.locator('.fact-grid [data-archive-projection-field="venue"]:visible').count(),
    1,
    '场次详情应显示投影地点',
  );
  assert.equal(
    await archivePage
      .locator('h1 [data-archive-projection-source]')
      .evaluate((element) => window.getComputedStyle(element).display),
    'none',
    '场次详情不应同时显示等级 0 标题',
  );
  assert.notEqual(
    await archivePage
      .locator('[data-pollution-slot="record"]')
      .evaluate((element) => window.getComputedStyle(element).transform),
    'none',
    '三级污染场次详情应让记录物件脱离稳定框景',
  );
  const programLinks = archivePage.locator('.program-order a[data-archive-invitation-trigger]');
  assert.ok(await programLinks.count(), '场次详情应保留受控的原剧目关联入口');
  const archiveProductionTarget = await programLinks.first().getAttribute('href');
  assert.ok(archiveProductionTarget, '场次详情剧目入口应保留原链接');
  await programLinks.first().click();
  await archivePage.locator('[data-archive-invitation][open]').waitFor();
  await archivePage.locator('[data-archive-invitation-close]').first().click();
  await archivePage.goto(new URL(archiveProductionTarget, origin).href);
  assert.equal(
    await archivePage.locator('h1 [data-archive-projection-field="title"]:visible').count(),
    1,
    '剧目详情 H1 应显示职责化投影标题',
  );
  const creditCount = await archivePage.locator('.archive-credit-list > div').count();
  assert.ok(creditCount, '剧目详情应保留原人员记录数量');
  assert.equal(
    await archivePage.locator('[data-archive-projection-field="role"]:visible').count(),
    creditCount,
    '剧目详情职责应逐项收束',
  );
  assert.equal(
    new Set(
      await archivePage
        .locator('[data-archive-projection-field="role-name"]:visible')
        .allTextContents(),
    ).size,
    1,
    '剧目详情人员应收束为同一邀请身份',
  );
  const relatedLinks = archivePage.locator('.related-links a[data-archive-invitation-trigger]');
  assert.ok(await relatedLinks.count(), '剧目详情应保留受控的原场次关联入口');
  await archivePage.goto(`${origin}${archivePath('yan', 'troupe')}`);
  assert.ok((await archivePage.locator('h1').textContent())?.trim(), '剧团页应保留 H1 任务标题');
  const officeCount = await archivePage.locator('.archive-company dl > div').count();
  assert.ok(officeCount, '剧团页应保留原职责记录数量');
  assert.equal(
    await archivePage.locator('[data-archive-projection-field="role"]:visible').count(),
    officeCount,
    '剧团页职责应逐项收束',
  );
  assert.notEqual(
    await archivePage
      .locator('[data-pollution-slot="company-record"]')
      .evaluate((element) => window.getComputedStyle(element).transform),
    'none',
    '三级污染剧团名册应脱离稳定框景',
  );
  const companyInvitationTrigger = archivePage.locator(
    '.archive-company [data-archive-invitation-trigger]',
  );
  await companyInvitationTrigger.click();
  await archivePage.locator('[data-archive-invitation][open]').waitFor();
  await archivePage.locator('[data-archive-invitation-close]').first().click();
  await archivePage.goto(
    `${origin}${archivePath('yan', 'search')}?q=${encodeURIComponent('湖中')}`,
  );
  await archivePage.locator('[data-search-enhanced]:not([hidden])').waitFor();
  const projectedSearchResults = archivePage.locator('[data-search-results] > li');
  const expectedSearchResultCount = await archivePage
    .locator('[data-site-search]')
    .evaluate((root, query) => {
      const locale = root.getAttribute('data-search-locale') ?? document.documentElement.lang;
      const normalizedQuery = String(query).normalize('NFKC').trim().toLocaleLowerCase(locale);
      const entries = JSON.parse(root.getAttribute('data-search-index') ?? '[]');
      return entries.filter((entry) =>
        `${entry.title} ${entry.summary} ${entry.keywords}`
          .normalize('NFKC')
          .trim()
          .toLocaleLowerCase(locale)
          .includes(normalizedQuery),
      ).length;
    }, '湖中');
  assert.ok(expectedSearchResultCount, '搜索基准查询应命中稳定索引');
  assert.equal(
    await projectedSearchResults.count(),
    expectedSearchResultCount,
    '三级污染搜索不得改变匹配与计数',
  );
  assert.equal(
    new Set(
      await projectedSearchResults
        .locator('[data-archive-projection-field="search-title"]:visible')
        .allTextContents(),
    ).size,
    1,
    '三级污染搜索标题应收束为同一回应',
  );
  assert.notEqual(
    await archivePage
      .locator('[data-pollution-slot="search"]')
      .evaluate((element) => window.getComputedStyle(element).transform),
    'none',
    '三级污染搜索工作区应参与页面环境失序',
  );
  const projectedSearchLink = projectedSearchResults
    .locator('a[data-archive-invitation-trigger][href]')
    .first();
  assert.ok(await projectedSearchLink.getAttribute('href'), '搜索投影应保留原结果链接');
  await projectedSearchLink.click();
  await archivePage.locator('[data-archive-invitation][open]').waitFor();
  await archivePage.locator('[data-archive-invitation-close]').first().click();
  await archivePage.goto(`${origin}${archivePath('yan', 'tickets')}`);
  const projectedSeatEntries = archivePage.locator('.archive-seat-register > ol > li');
  assert.equal(
    await projectedSeatEntries.count(),
    expectedArchiveSeatCount,
    '三级污染静态席位不得改变同期场次数量',
  );
  assert.equal(
    await projectedSeatEntries.locator('[data-archive-projection-field="venue"]:visible').count(),
    expectedArchiveSeatCount,
    '三级污染席位地点应逐项收束',
  );
  const projectedSeatSelect = projectedSeatEntries.locator('select').first();
  assert.equal(await projectedSeatSelect.isEnabled(), true, '投影不得破坏静态分区选择');
  assert.notEqual(
    await archivePage
      .locator('[data-pollution-slot="ticket-record"]')
      .evaluate((element) => window.getComputedStyle(element).transform),
    'none',
    '三级污染席位登记应参与页面环境失序',
  );
  const projectedSettlement = archivePage.locator(
    '.archive-settlement[data-archive-projection-level3]:visible',
  );
  const projectedSettlementTrigger = projectedSettlement.locator(
    'button[data-archive-invitation-trigger]',
  );
  assert.equal(await projectedSettlementTrigger.isEnabled(), true, '席位投影入口应保持可操作');
  await projectedSettlementTrigger.click();
  await archivePage.locator('[data-archive-invitation][open]').waitFor();
  assert.equal(
    await archivePage.locator('[data-archive-invitation-continue]').getAttribute('hidden'),
    '',
    '静态席位投影只发出邀请，不得伪造结算或导航',
  );
  await archivePage.locator('[data-archive-invitation-close]').first().click();
  await archivePage.goto(`${origin}${archivePath('yan')}`);
  const archiveInvitation = archivePage.locator('[data-archive-invitation]');
  assert.equal(
    await archiveInvitation.getAttribute('open'),
    null,
    '等级 3 初次呈现不应自动打开邀请',
  );
  const archiveInvitationTrigger = archivePage.locator('[data-archive-invitation-trigger]').first();
  const archiveInvitationTarget = await archiveInvitationTrigger.getAttribute('href');
  assert.ok(archiveInvitationTarget, '邀请触发器应保留原合法链接');
  await archiveInvitationTrigger.click();
  await archivePage.locator('[data-archive-invitation][open]').waitFor();
  assert.equal(
    await archiveInvitation.evaluate((element) => window.getComputedStyle(element).overflowX),
    'hidden',
    '邀请装饰不得制造横向滚动条',
  );
  await archivePage.locator('[data-archive-invitation-close]').first().click();
  assert.equal(
    await archiveInvitationTrigger.evaluate((element) => element === document.activeElement),
    true,
    '关闭邀请后焦点应返回原触发器',
  );
  await archiveInvitationTrigger.click();
  await archivePage.locator('[data-archive-invitation][open]').waitFor();
  await archivePage.locator('[data-archive-invitation-continue]').click();
  await archivePage.waitForURL(new URL(archiveInvitationTarget, origin).href);
  await archivePage.locator('[data-world-switch="front"]').waitFor();
  await assertNoHorizontalLoss(archivePage, '320px 炎国三级污染里站');
  await assertControlsWithinViewport(
    archivePage,
    '[data-pollution-safe] a, [data-pollution-safe] button, [data-pollution-safe] summary',
    '320px 炎国三级污染里站',
  );
  assertArchiveErrors();
  await archiveContext.close();

  const minosArchiveContext = await browser.newContext({
    viewport: { width: 320, height: 800 },
    reducedMotion: 'reduce',
  });
  await minosArchiveContext.addInitScript(() => {
    sessionStorage.setItem(
      'crimson-troupe:archive-pollution:v2',
      JSON.stringify({ version: 2, level: 3, eventCount: 8, variant: 1 }),
    );
  });
  const minosArchivePage = await minosArchiveContext.newPage();
  const assertMinosArchiveErrors = trackUnexpectedErrors(minosArchivePage);
  await minosArchivePage.goto(`${origin}${archivePath('min')}`);
  await minosArchivePage.locator('html[data-pollution-level="3"]').waitFor();
  const minosInvitation = minosArchivePage.locator('[data-archive-invitation]');
  assert.equal(await minosInvitation.getAttribute('open'), null);
  await minosArchivePage.locator('[data-archive-invitation-trigger]').first().click();
  await minosArchivePage.locator('[data-archive-invitation][open]').waitFor();
  await assertArchiveInvitationArtifact(
    minosArchivePage,
    getLocalization(editions.minos, buildSnapshot),
    '320px 米诺斯语三级污染请柬',
    true,
  );
  await minosArchivePage.locator('[data-world-switch="front"]').waitFor();
  await assertNoHorizontalLoss(minosArchivePage, '320px 米诺斯语三级污染里站');
  await minosArchivePage.locator('[data-archive-invitation-close]').first().click();
  assertMinosArchiveErrors();
  await minosArchiveContext.close();

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
  await noScriptPage.goto(`${origin}${archivePath('hig', 'tickets')}`);
  const archiveSeatSelects = noScriptPage.locator('.archive-seat-register select');
  assert.equal(
    await archiveSeatSelects.count(),
    expectedArchiveSeatCount,
    '东国语里站应显示全部同期可登记场次',
  );
  for (const { performanceId, offers } of expectedArchiveSeats) {
    const select = noScriptPage.locator(`#archive-zone-${performanceId}`);
    assert.deepEqual(
      await select.locator('option').evaluateAll((options) =>
        options.map((option) => ({
          zone: option.value,
          text: option.textContent?.trim() ?? '',
        })),
      ),
      offers.map(({ zone, basePrice }) => ({
        zone,
        text: `${getLocalization(editions.higashi, buildSnapshot).programs.ticketZones[zone]} · ${basePrice} LMD`,
      })),
      `${performanceId} 应显示唯一矩阵生成的分区和价格`,
    );
  }
  await archiveSeatSelects.first().selectOption({ index: 1 });
  assert.notEqual(await archiveSeatSelects.first().inputValue(), 'C');
  assert.equal(
    await noScriptPage
      .locator('.archive-settlement[data-archive-projection-source] button')
      .isDisabled(),
    true,
  );
  assert.equal(
    await noScriptPage.locator('.archive-settlement[data-archive-projection-level3]').isVisible(),
    false,
    '无脚本等级 0 不应显示三级邀请入口',
  );
  assert.equal(await noScriptPage.locator('[data-ticketing-app]').count(), 0);
  await assertNoHorizontalLoss(noScriptPage, '390px 东国语无脚本里站席位登记');
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
    `browser validation passed (${browserEngine}): editorial home alternation/mobile order, full-list isolation, ranked/grouped search keyboard path, seven venue level maps/zones, build-scoped edition selector, long-script 320px headers, ticket focus/artifact, Minos search/download/print, Ursus search isolation/download/cross-edition state/archive exit, archive four-level visual escalation/cross-edition level 3/reduced motion, 320/768 protected controls, localized pollution live status, keyboard invitation exit/continue, no-JS fallback/static archive seats, search failure fallback`,
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
