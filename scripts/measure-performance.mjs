#!/usr/bin/env node
/* global CSS, document, HTMLElement, HTMLImageElement, MutationObserver, requestAnimationFrame, window */

import { chromium, firefox, webkit } from 'playwright';

const stateKey = 'crimson-troupe:archive-pollution:v2';
const pendingKey = 'crimson-troupe:archive-navigation:v2';
const baseUrl = new URL(process.env.PERF_BASE_URL ?? 'http://127.0.0.1:4321');
const runs = Number(process.env.PERF_RUNS ?? '5');
const cpuRate = Number(process.env.PERF_CPU_RATE ?? '4');
const frameCount = Number(process.env.PERF_FRAME_COUNT ?? '60');
const networkProfile = process.env.PERF_NETWORK_PROFILE ?? 'mobile4g';
const chromeExecutablePath = process.env.PERF_CHROME_EXECUTABLE_PATH;
const edgeExecutablePath = process.env.PERF_EDGE_EXECUTABLE_PATH;
// 本地预览不应经开发机代理，保持三引擎测试相同来源。
if (['127.0.0.1', 'localhost', '[::1]'].includes(baseUrl.hostname)) {
  process.env.NO_PROXY = [process.env.NO_PROXY, baseUrl.hostname].filter(Boolean).join(',');
  process.env.no_proxy = [process.env.no_proxy, baseUrl.hostname].filter(Boolean).join(',');
}
const networkProfiles = {
  none: null,
  wifi: {
    latency: 20,
    downloadThroughput: 40_000_000 / 8,
    uploadThroughput: 10_000_000 / 8,
    connectionType: 'wifi',
  },
  mobile4g: {
    latency: 150,
    downloadThroughput: (1_600_000 / 8) * 0.9,
    uploadThroughput: (750_000 / 8) * 0.9,
    connectionType: 'cellular4g',
  },
  mobile3g: {
    latency: 400,
    downloadThroughput: (400_000 / 8) * 0.9,
    uploadThroughput: (400_000 / 8) * 0.9,
    connectionType: 'cellular3g',
  },
};

if (!Number.isSafeInteger(runs) || runs < 1 || runs > 20) {
  throw new Error('PERF_RUNS 必须是 1 到 20 之间的整数');
}
if (!Number.isSafeInteger(cpuRate) || cpuRate < 1 || cpuRate > 20) {
  throw new Error('PERF_CPU_RATE 必须是 1 到 20 之间的整数');
}
if (!Number.isSafeInteger(frameCount) || frameCount < 30 || frameCount > 180) {
  throw new Error('PERF_FRAME_COUNT 必须是 30 到 180 之间的整数');
}
if (!Object.hasOwn(networkProfiles, networkProfile)) {
  throw new Error('PERF_NETWORK_PROFILE 只能是 wifi、mobile4g、mobile3g 或 none');
}

const browserDefinitions = {
  chromium: {
    browserType: chromium,
    cdp: true,
    launchOptions: {},
  },
  chrome: {
    browserType: chromium,
    cdp: true,
    launchOptions: chromeExecutablePath
      ? { executablePath: chromeExecutablePath }
      : { channel: 'chrome' },
  },
  firefox: {
    browserType: firefox,
    cdp: false,
    launchOptions: {},
  },
  webkit: {
    browserType: webkit,
    cdp: false,
    launchOptions: {},
  },
  edge: {
    browserType: chromium,
    cdp: true,
    launchOptions: edgeExecutablePath
      ? { executablePath: edgeExecutablePath }
      : { channel: 'msedge' },
  },
};

const requestedBrowserIds = (process.env.PERF_BROWSERS ?? 'chromium')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const unknownBrowserIds = requestedBrowserIds.filter(
  (browserId) => !Object.hasOwn(browserDefinitions, browserId),
);
if (requestedBrowserIds.length === 0 || unknownBrowserIds.length > 0) {
  throw new Error(
    `PERF_BROWSERS 必须从 chromium、chrome、firefox、webkit、edge 中选择：${unknownBrowserIds.join(', ') || '当前为空'}`,
  );
}
const browserIds = [...new Set(requestedBrowserIds)];

const viewports = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

const scenarioFilter = new Set(
  (process.env.PERF_SCENARIOS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
);

const allScenarios = [
  { id: 'front-home-mobile', path: '/yan/', viewport: 'mobile' },
  { id: 'front-tickets-mobile', path: '/yan/tickets/', viewport: 'mobile' },
  {
    id: 'archive-home-l0-mobile',
    path: '/yan/archive/site/1084-07-01/',
    level: 0,
    viewport: 'mobile',
  },
  {
    id: 'archive-home-l2-mobile',
    path: '/yan/archive/site/1084-07-01/',
    level: 2,
    viewport: 'mobile',
  },
  { id: 'higashi-front-mobile', path: '/hig/', viewport: 'mobile' },
  { id: 'minos-tickets-mobile', path: '/min/tickets/', viewport: 'mobile' },
  {
    id: 'ursus-archive-mobile',
    path: '/urs/archive/site/1084-07-01/',
    level: 2,
    viewport: 'mobile',
  },
  { id: 'front-home', path: '/yan/', viewport: 'desktop' },
  { id: 'front-tickets', path: '/yan/tickets/', viewport: 'desktop' },
  { id: 'archive-home-l0', path: '/yan/archive/site/1084-07-01/', level: 0, viewport: 'desktop' },
  { id: 'archive-home-l1', path: '/yan/archive/site/1084-07-01/', level: 1, viewport: 'desktop' },
  { id: 'archive-home-l2', path: '/yan/archive/site/1084-07-01/', level: 2, viewport: 'desktop' },
  { id: 'archive-home-l3', path: '/yan/archive/site/1084-07-01/', level: 3, viewport: 'desktop' },
  {
    id: 'archive-performances-l3',
    path: '/yan/archive/site/1084-07-01/performances/',
    level: 3,
    viewport: 'desktop',
  },
  {
    id: 'archive-performances-l3-mobile',
    path: '/yan/archive/site/1084-07-01/performances/',
    level: 3,
    viewport: 'mobile',
  },
];
const unknownScenarios = [...scenarioFilter].filter(
  (id) => !allScenarios.some((scenario) => scenario.id === id),
);
if (unknownScenarios.length) {
  throw new Error(`PERF_SCENARIOS 包含未知场景：${unknownScenarios.join(', ')}`);
}
const scenarios = scenarioFilter.size
  ? allScenarios.filter((scenario) => scenarioFilter.has(scenario.id))
  : allScenarios.filter((scenario) => scenario.path.startsWith('/yan/'));

if (scenarios.length === 0) {
  throw new Error(`PERF_SCENARIOS 未匹配已知场景：${[...scenarioFilter].join(', ')}`);
}

function percentile(values, fraction) {
  const sorted = [...values].sort((first, second) => first - second);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * fraction) - 1));
  return sorted[index];
}

function round(value, precision = 1) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function summarize(samples, key) {
  const values = samples
    .map((sample) => sample[key])
    .filter((value) => typeof value === 'number' && Number.isFinite(value));
  if (values.length === 0) {
    return { median: null, p95: null };
  }
  return {
    median: round(percentile(values, 0.5), key === 'cls' ? 4 : 1),
    p95: round(percentile(values, 0.95), key === 'cls' ? 4 : 1),
  };
}

function readMetric(metrics, name) {
  return metrics.find((metric) => metric.name === name)?.value ?? null;
}

async function measureScrollFrames(page) {
  return page.evaluate(async (sampleCount) => {
    const root = document.documentElement;
    const originalX = window.scrollX;
    const originalY = window.scrollY;
    const maximumScroll = Math.max(0, root.scrollHeight - window.innerHeight);
    const durations = [];
    let previous = performance.now();

    for (let index = 0; index < sampleCount; index += 1) {
      const timestamp = await new Promise((resolve) => requestAnimationFrame(resolve));
      durations.push(timestamp - previous);
      previous = timestamp;
      if (maximumScroll > 0) {
        const progress = index / Math.max(1, sampleCount - 1);
        const travel = progress <= 0.5 ? progress * 2 : (1 - progress) * 2;
        window.scrollTo(0, maximumScroll * travel);
      }
    }

    window.scrollTo(originalX, originalY);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const sorted = [...durations].sort((first, second) => first - second);
    const percentileValue = (fraction) =>
      sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * fraction) - 1))] ??
      0;
    return {
      frameDurationMedian: percentileValue(0.5),
      frameDurationP95: percentileValue(0.95),
      frameDurationMax: sorted.at(-1) ?? 0,
      framesOver20ms: durations.filter((duration) => duration > 20).length,
      framesOver50ms: durations.filter((duration) => duration > 50).length,
      frameWindowDuration: durations.reduce((total, duration) => total + duration, 0),
    };
  }, frameCount);
}

async function installProbe(page, scenario) {
  await page.addInitScript(
    ({ level, path, pollutionStateKey, navigationPendingKey }) => {
      window.__crimsonPerformance = {
        stateApplied: null,
        stateSettled: null,
        cls: PerformanceObserver.supportedEntryTypes?.includes('layout-shift') ? 0 : null,
        shiftWindow: { start: 0, last: 0, score: 0 },
        lcp: null,
        longTaskSupported: PerformanceObserver.supportedEntryTypes?.includes('longtask') ?? false,
        longTasks: [],
      };

      const observeRoot = () => {
        const root = document.documentElement;
        if (!root) {
          requestAnimationFrame(observeRoot);
          return;
        }
        const recordState = () => {
          const probe = window.__crimsonPerformance;
          if (probe.stateApplied === null && root.dataset.pollutionLevel === String(level)) {
            probe.stateApplied = performance.now();
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                probe.stateSettled = performance.now();
              });
            });
          }
        };
        const observer = new MutationObserver(recordState);
        observer.observe(root, {
          attributes: true,
          attributeFilter: [
            'data-pollution-level',
            'data-pollution-variant',
            'data-pollution-composition',
          ],
        });
        // 快速的构建内联脚本可能已设置等级；记录首次观测上界，不能只等待后续变更。
        recordState();
      };
      observeRoot();

      try {
        new PerformanceObserver((list) => {
          window.__crimsonPerformance.lcp = list.getEntries().at(-1)?.startTime ?? null;
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      } catch {
        // 不支持 LCP 的引擎保持 null，不把缺失指标误报为零耗时。
      }

      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              const probe = window.__crimsonPerformance;
              const session = probe.shiftWindow;
              // CLS 取最大突发窗口：相邻间隔 <1s，总长度 <5s。
              if (
                session.score > 0 &&
                entry.startTime - session.last < 1000 &&
                entry.startTime - session.start < 5000
              ) {
                session.score += entry.value;
              } else {
                session.start = entry.startTime;
                session.score = entry.value;
              }
              session.last = entry.startTime;
              probe.cls = Math.max(probe.cls ?? 0, session.score);
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });
      } catch {
        window.__crimsonPerformance.cls = null;
        // 未能安装观察器时保持缺失，不把它记为零布局偏移。
      }

      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            window.__crimsonPerformance.longTasks.push({
              startTime: entry.startTime,
              duration: entry.duration,
            });
          }
        }).observe({ type: 'longtask', buffered: true });
      } catch {
        window.__crimsonPerformance.longTaskSupported = false;
        // Long-task observation is supplementary to the CDP task duration.
      }

      if (level === undefined) {
        return;
      }
      const state = { version: 2, level, eventCount: Math.max(3, level + 2), variant: 0, seed: 42 };
      sessionStorage.setItem(pollutionStateKey, JSON.stringify(state));
      sessionStorage.setItem(
        navigationPendingKey,
        JSON.stringify({ targetPath: path, expiresAt: Date.now() + 60_000 }),
      );
    },
    {
      level: scenario.level,
      path: scenario.path,
      pollutionStateKey: stateKey,
      navigationPendingKey: pendingKey,
    },
  );
}

async function measureScenario(browser, browserDefinition, scenario) {
  const samples = [];
  for (let run = 0; run < runs; run += 1) {
    const context = await browser.newContext({
      viewport: viewports[scenario.viewport],
      deviceScaleFactor: scenario.viewport === 'mobile' ? 2 : 1,
      hasTouch: scenario.viewport === 'mobile',
    });
    const page = await context.newPage();
    const pageErrors = [];
    const requestFailures = [];
    const imageRequestAborts = [];
    const httpErrors = [];
    page.on('response', (response) => {
      if (response.status() >= 400) httpErrors.push(`${response.status()} ${response.url()}`);
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('requestfailed', (request) => {
      const failure = request.failure()?.errorText ?? 'unknown';
      const target =
        request.resourceType() === 'image' && /ABORTED|cancelled/iu.test(failure)
          ? imageRequestAborts
          : requestFailures;
      target.push(`${request.method()} ${request.url()}: ${failure}`);
    });
    const client = browserDefinition.cdp ? await context.newCDPSession(page) : null;
    if (client) {
      await client.send('Performance.enable');
      if (cpuRate > 1) {
        await client.send('Emulation.setCPUThrottlingRate', { rate: cpuRate });
      }
      if (networkProfiles[networkProfile]) {
        await client.send('Network.enable');
        await client.send('Network.emulateNetworkConditions', {
          offline: false,
          ...networkProfiles[networkProfile],
        });
      }
    }
    await installProbe(page, scenario);

    const response = await page.goto(new URL(scenario.path, baseUrl).href, {
      waitUntil: 'load',
      timeout: 60_000,
    });
    let viewportImagesTimedOut = false;
    try {
      await page.waitForFunction(
        () =>
          [...document.images].every((image) => {
            const poster = image.closest('[data-folio-cover]');
            const bounds = (poster ?? image).getBoundingClientRect();
            if (
              bounds.width === 0 ||
              bounds.height === 0 ||
              bounds.top >= window.innerHeight ||
              bounds.bottom <= 0
            )
              return true;
            if (
              poster &&
              (poster.hasAttribute('data-folio-concealed') ||
                (poster.dataset.folioRequested &&
                  poster.dataset.folioEdition !== poster.dataset.folioRequested))
            )
              return false;
            return image.complete && image.naturalWidth > 0;
          }),
        null,
        { timeout: 30_000 },
      );
    } catch (error) {
      if (error.name !== 'TimeoutError') throw error;
      viewportImagesTimedOut = true;
    }
    // 这是 load 后的就绪确认上界，独立于 LCP；不把文字 LCP 当作封面已就绪。
    const viewportImagesReadyAt = viewportImagesTimedOut
      ? null
      : await page.evaluate(() => performance.now());
    await page.waitForTimeout(1_000);

    const [pageMetrics, cdpMetrics] = await Promise.all([
      page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const fcp = performance.getEntriesByName('first-contentful-paint')[0];
        const probe = window.__crimsonPerformance;
        const resources = performance.getEntriesByType('resource');
        const visibleFolios = [...document.querySelectorAll('[data-folio-cover]')].filter(
          (poster) => {
            const bounds = poster.getBoundingClientRect();
            return bounds.top < window.innerHeight && bounds.bottom > 0;
          },
        );
        return {
          domContentLoaded: navigation?.domContentLoadedEventEnd ?? null,
          load: navigation?.loadEventEnd ?? null,
          fcp: fcp?.startTime ?? null,
          lcp: probe.lcp,
          // load 和等级属性就绪不等于污染图片已呈现，独立记录首屏图片状态。
          folioPendingCount: visibleFolios.filter((poster) => {
            const image = poster.querySelector('[data-folio-image]');
            return (
              !image?.complete ||
              !image.naturalWidth ||
              poster.hasAttribute('data-folio-concealed') ||
              poster.dataset.folioEdition !== poster.dataset.folioRequested
            );
          }).length,
          folioFallbackCount: visibleFolios.filter((poster) =>
            poster.hasAttribute('data-folio-fallback'),
          ).length,
          stateApplied: probe.stateApplied,
          stateSettleDuration:
            probe.stateApplied !== null && probe.stateSettled !== null
              ? probe.stateSettled - probe.stateApplied
              : null,
          cls: probe.cls,
          longTaskCount: probe.longTaskSupported ? probe.longTasks.length : null,
          longTaskDuration: probe.longTaskSupported
            ? probe.longTasks.reduce((total, task) => total + task.duration, 0)
            : null,
          navigationTransfer: navigation?.transferSize ?? null,
          navigationEncoded: navigation?.encodedBodySize ?? null,
          pageTransfer:
            (navigation?.transferSize ?? 0) +
            resources.reduce((total, entry) => total + (entry.transferSize ?? 0), 0),
          pageEncoded:
            (navigation?.encodedBodySize ?? 0) +
            resources.reduce((total, entry) => total + (entry.encodedBodySize ?? 0), 0),
          resourceTransfer: resources.reduce(
            (total, entry) => total + (entry.transferSize ?? 0),
            0,
          ),
          resourceEncoded: resources.reduce(
            (total, entry) => total + (entry.encodedBodySize ?? 0),
            0,
          ),
          nodeCount: document.getElementsByTagName('*').length,
          level: document.documentElement.dataset.pollutionLevel ?? null,
          featureSupport: {
            contain: CSS.supports('contain', 'layout paint'),
            contentVisibility: CSS.supports('content-visibility', 'auto'),
            colorMix: CSS.supports('color', 'color-mix(in srgb, black 50%, white)'),
            mask: CSS.supports(
              'mask',
              'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\'/>")',
            ),
            dialog: 'HTMLDialogElement' in window,
            inert: 'inert' in HTMLElement.prototype,
            imageDecode: 'decode' in HTMLImageElement.prototype,
            layoutShiftObserver:
              PerformanceObserver.supportedEntryTypes?.includes('layout-shift') ?? false,
            longTaskObserver:
              PerformanceObserver.supportedEntryTypes?.includes('longtask') ?? false,
          },
        };
      }),
      client?.send('Performance.getMetrics') ?? Promise.resolve({ metrics: [] }),
    ]);
    // 先冻结初始采样，再滚动，避免滚动触发的懒加载混入同一时点。
    const frameMetrics = await measureScrollFrames(page);
    let scrollResourcesSettled = true;
    try {
      await page.waitForLoadState('networkidle', { timeout: 60_000 });
    } catch (error) {
      if (error.name !== 'TimeoutError') throw error;
      scrollResourcesSettled = false;
    }
    const scrollPageTransfer = scrollResourcesSettled
      ? await page.evaluate(
          () =>
            performance
              .getEntriesByType('navigation')
              .reduce((sum, entry) => sum + entry.transferSize, 0) +
            performance
              .getEntriesByType('resource')
              .reduce((sum, entry) => sum + entry.transferSize, 0),
        )
      : null;
    const metrics = cdpMetrics.metrics;
    samples.push({
      ...pageMetrics,
      ...frameMetrics,
      status: response?.status() ?? 0,
      viewportImagesReadyAt,
      viewportImagesTimedOut,
      scrollPageTransfer,
      scrollResourcesSettled,
      layoutDuration:
        readMetric(metrics, 'LayoutDuration') === null
          ? null
          : readMetric(metrics, 'LayoutDuration') * 1_000,
      recalcStyleDuration:
        readMetric(metrics, 'RecalcStyleDuration') === null
          ? null
          : readMetric(metrics, 'RecalcStyleDuration') * 1_000,
      scriptDuration:
        readMetric(metrics, 'ScriptDuration') === null
          ? null
          : readMetric(metrics, 'ScriptDuration') * 1_000,
      taskDuration:
        readMetric(metrics, 'TaskDuration') === null
          ? null
          : readMetric(metrics, 'TaskDuration') * 1_000,
      jsHeapUsed: readMetric(metrics, 'JSHeapUsedSize'),
      pageErrors,
      requestFailures,
      imageRequestAborts,
      httpErrors,
    });
    await context.close();
  }

  const keys = [
    'domContentLoaded',
    'load',
    'fcp',
    'lcp',
    'folioPendingCount',
    'folioFallbackCount',
    'stateApplied',
    'stateSettleDuration',
    'layoutDuration',
    'recalcStyleDuration',
    'scriptDuration',
    'taskDuration',
    'longTaskCount',
    'longTaskDuration',
    'cls',
    'viewportImagesReadyAt',
    'navigationTransfer',
    'navigationEncoded',
    'pageTransfer',
    'pageEncoded',
    'scrollPageTransfer',
    'resourceTransfer',
    'resourceEncoded',
    'nodeCount',
    'jsHeapUsed',
    'frameDurationMedian',
    'frameDurationP95',
    'frameDurationMax',
    'framesOver20ms',
    'framesOver50ms',
    'frameWindowDuration',
  ];
  return {
    id: scenario.id,
    path: scenario.path,
    viewport: scenario.viewport,
    deviceScaleFactor: scenario.viewport === 'mobile' ? 2 : 1,
    level: scenario.level ?? null,
    samples,
    summary: Object.fromEntries(keys.map((key) => [key, summarize(samples, key)])),
  };
}

const browserResults = [];
for (const browserId of browserIds) {
  const browserDefinition = browserDefinitions[browserId];
  const browser = await browserDefinition.browserType.launch({
    headless: true,
    ...browserDefinition.launchOptions,
  });
  try {
    const scenarioResults = [];
    for (const scenario of scenarios) {
      scenarioResults.push(await measureScenario(browser, browserDefinition, scenario));
      process.stderr.write(`[performance] ${browserId}: ${scenario.id} (${runs} samples)\n`);
    }
    browserResults.push({
      browserId,
      version: browser.version(),
      cdpMetrics: browserDefinition.cdp,
      cpuThrottling: browserDefinition.cdp ? cpuRate : 1,
      networkProfile: browserDefinition.cdp ? networkProfile : 'none',
      networkConditions: browserDefinition.cdp ? networkProfiles[networkProfile] : null,
      results: scenarioResults,
    });
  } finally {
    await browser.close();
  }
}

const report = {
  baseUrl: baseUrl.href,
  runs,
  requestedCpuRate: cpuRate,
  requestedNetworkProfile: networkProfile,
  frameCount,
  note: '实验室样本，不是生产环境或真实设备的 Web Vitals。pageTransfer 包含导航及采样时已完成的子资源，scrollPageTransfer 在固定滚动后采样；Resource Timing 不保证计入中止请求的已传输字节。viewportImagesReadyAt 为 load 后首屏图像就绪的确认上界。CLS 为采样前最大会话窗口，非整次访问；不支持的指标为 null。CPU、网络及 CDP 指标只适用于 Chromium 系；跨引擎比较使用 PERF_CPU_RATE=1 PERF_NETWORK_PROFILE=none。',
  browsers: browserResults,
};
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (
  browserResults.some((browser) =>
    browser.results.some((scenario) =>
      scenario.samples.some(
        (sample) =>
          sample.status !== 200 ||
          sample.pageErrors.length ||
          sample.requestFailures.length ||
          sample.httpErrors.length ||
          sample.viewportImagesTimedOut ||
          !sample.scrollResourcesSettled ||
          (scenario.level !== null &&
            (sample.level !== String(scenario.level) ||
              sample.stateApplied === null ||
              sample.stateSettleDuration === null)),
      ),
    ),
  )
) {
  process.exitCode = 1;
}
