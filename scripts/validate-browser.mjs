#!/usr/bin/env node
/* global document, window */

import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import net from 'node:net';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

import { currentArchiveSnapshot } from '../src/data/archive-snapshots.ts';
import { buildSnapshot } from '../src/data/content/resolve.ts';

const serverHost = '127.0.0.1';
const repositoryRoot = fileURLToPath(new URL('..', import.meta.url));
const astroBin = fileURLToPath(new URL('../node_modules/astro/bin/astro.mjs', import.meta.url));
const expectedArchiveSeatCount = buildSnapshot.performanceEntries.filter(
  ([, performance]) =>
    performance.world === 'archive' &&
    performance.collection === 'current' &&
    performance.status === 'scheduled' &&
    performance.ticketAvailability.state === 'on-sale',
).length;
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
  assert.equal(await selector.locator('li').count(), 5, '五语言 preview 应显示五个版本选项');
  assert.equal(await selector.locator('li .edition-badge').count(), 5, '每个版本选项都应显示徽记');
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
  await desktopPage.goto(`${origin}${archivePath('yan')}`);
  await assertEditorialAlternation(
    desktopPage,
    '.archive-performance-list--home-editorial',
    '.archive-poster',
    '.archive-performance-list__register',
    '1280px 炎国里站首页',
  );
  await desktopPage.goto(`${origin}${archivePath('yan', 'performances')}`);
  assert.equal(
    await desktopPage.locator('.archive-performance-list--home-editorial').count(),
    0,
    '里站完整本季列表不得套用首页编排',
  );
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
  const seatingPlans = [
    { id: 'trimount-grand-fan', levels: 3, zones: ['C', 'B', 'A', 'S', 'BOX'] },
    { id: 'wiesheim-mirror-horseshoe', levels: 3, zones: ['C', 'B', 'A', 'S', 'BOX'] },
    { id: 'norport-temporary-stand', levels: 1, zones: ['C', 'B', 'A'] },
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
  const firstTicketRow = ticketRows.first();
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
  await minosPage.locator('[data-ticket-action="resolve"]').click();
  await minosPage.locator('[data-ticket-result]:not([hidden])').waitFor();
  const minosTicketSource = await minosPage.locator('.issued-ticket > img').getAttribute('src');
  assert.match(decodeURIComponent(minosTicketSource ?? ''), /\p{Script=Greek}/u);
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
  assert.match(new URL(minosPage.url()).pathname, /^\/yan\/tickets\/$/u);
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
      for (const locale of ['en-US', 'el', 'ru']) {
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
  await ursusPage.locator('[data-ticket-action="resolve"]').click();
  await ursusPage.locator('[data-ticket-result]:not([hidden])').waitFor();
  const editionRouteSequence = ['yan', 'hig', 'col', 'min', 'urs'];
  for (const routePrefix of editionRouteSequence) {
    const editionSelector = ursusPage.locator('[data-edition-selector]');
    await editionSelector.locator('summary').click();
    await editionSelector.locator(`a[href^="/${routePrefix}/tickets/"]`).click();
    await ursusPage.locator('[data-ticket-result]:not([hidden])').waitFor();
    assert.match(new URL(ursusPage.url()).pathname, new RegExp(`^/${routePrefix}/tickets/$`, 'u'));
  }
  const ursusTicketSource = await ursusPage.locator('.issued-ticket > img').getAttribute('src');
  assert.match(decodeURIComponent(ursusTicketSource ?? ''), /\p{Script=Cyrillic}/u);
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
  await archivePage.goto(`${origin}/yan/archive/site/1091/`);
  await archivePage.waitForURL(
    `${origin}/yan/archive/site/${currentArchiveSnapshot.routeSegment}/`,
  );
  await archivePage.locator('html[data-pollution-level="3"]').waitFor();
  await assertArchiveProjectionList(archivePage, expectedArchiveCurrentCount, '三级污染里站首页');
  await archivePage.goto(`${origin}${archivePath('yan', 'performances')}`);
  await assertArchiveProjectionList(
    archivePage,
    expectedArchiveCurrentCount,
    '三级污染里站本季演出',
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
    'browser validation passed: editorial home alternation/mobile order, full-list isolation, three venue level maps/zones, five-edition selector, long-script 320px headers, ticket focus/artifact, Minos search/download/print, Ursus search isolation/download/five-edition state/archive exit, archive level 3/reduced motion, no-JS fallback/static archive seats, search failure fallback',
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
