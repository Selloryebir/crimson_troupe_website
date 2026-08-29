#!/usr/bin/env node
/* global CSS, document, HTMLElement, HTMLImageElement, MutationObserver, requestAnimationFrame, window */

import { chromium, firefox, webkit } from 'playwright';

const stateKey = 'crimson-troupe:archive-pollution:v2';
const pendingKey = 'crimson-troupe:archive-navigation:v2';
const baseUrl = new URL(process.env.PERF_BASE_URL ?? 'http://127.0.0.1:4321');
const runs = Number.parseInt(process.env.PERF_RUNS ?? '5', 10);
const cpuRate = Number.parseInt(process.env.PERF_CPU_RATE ?? '4', 10);
const frameCount = Number.parseInt(process.env.PERF_FRAME_COUNT ?? '60', 10);
const networkProfile = process.env.PERF_NETWORK_PROFILE ?? 'mobile4g';
const chromeExecutablePath = process.env.PERF_CHROME_EXECUTABLE_PATH;
const edgeExecutablePath = process.env.PERF_EDGE_EXECUTABLE_PATH;

if (!Number.isSafeInteger(runs) || runs < 1 || runs > 20) {
  throw new Error('PERF_RUNS 必须是 1 到 20 之间的整数');
}
if (!Number.isSafeInteger(cpuRate) || cpuRate < 1 || cpuRate > 20) {
  throw new Error('PERF_CPU_RATE 必须是 1 到 20 之间的整数');
}
if (!Number.isSafeInteger(frameCount) || frameCount < 30 || frameCount > 180) {
  throw new Error('PERF_FRAME_COUNT 必须是 30 到 180 之间的整数');
}
if (!['mobile4g', 'none'].includes(networkProfile)) {
  throw new Error('PERF_NETWORK_PROFILE 只能是 mobile4g 或 none');
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
const scenarios = scenarioFilter.size
  ? allScenarios.filter((scenario) => scenarioFilter.has(scenario.id))
  : allScenarios;

if (scenarios.length === 0) {
  throw new Error(`PERF_SCENARIOS 未匹配已知场景：${[...scenarioFilter].join(', ')}`);
}

function percentile(values, fraction) {
  const sorted = [...values].sort((first, second) => first - second);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * fraction) - 1));
  return sorted[index];
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function summarize(samples, key) {
  const values = samples
    .map((sample) => sample[key])
    .filter((value) => typeof value === 'number' && Number.isFinite(value));
  if (values.length === 0) {
    return { median: null, p95: null };
  }
  return {
    median: round(percentile(values, 0.5)),
    p95: round(percentile(values, 0.95)),
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
        cls: 0,
        longTasks: [],
      };

      const observeRoot = () => {
        const root = document.documentElement;
        if (!root) {
          requestAnimationFrame(observeRoot);
          return;
        }
        const observer = new MutationObserver(() => {
          const probe = window.__crimsonPerformance;
          if (probe.stateApplied === null && root.dataset.pollutionLevel !== undefined) {
            probe.stateApplied = performance.now();
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                probe.stateSettled = performance.now();
              });
            });
          }
        });
        observer.observe(root, {
          attributes: true,
          attributeFilter: [
            'data-pollution-level',
            'data-pollution-variant',
            'data-pollution-composition',
          ],
        });
      };
      observeRoot();

      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              window.__crimsonPerformance.cls += entry.value;
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });
      } catch {
        // Older engines can omit layout-shift entries without invalidating the remaining metrics.
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
        // Long-task observation is supplementary to the CDP task duration.
      }

      if (level === undefined) {
        return;
      }
      const state = { version: 2, level, eventCount: Math.max(3, level + 2), variant: 0 };
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
    const context = await browser.newContext({ viewport: viewports[scenario.viewport] });
    const page = await context.newPage();
    const pageErrors = [];
    const requestFailures = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('requestfailed', (request) => {
      requestFailures.push(
        `${request.method()} ${request.url()}: ${request.failure()?.errorText ?? 'unknown'}`,
      );
    });
    const client = browserDefinition.cdp ? await context.newCDPSession(page) : null;
    if (client) {
      await client.send('Performance.enable');
      if (cpuRate > 1) {
        await client.send('Emulation.setCPUThrottlingRate', { rate: cpuRate });
      }
      if (networkProfile === 'mobile4g') {
        await client.send('Network.enable');
        await client.send('Network.emulateNetworkConditions', {
          offline: false,
          latency: 150,
          downloadThroughput: (1_600_000 / 8) * 0.9,
          uploadThroughput: (750_000 / 8) * 0.9,
          connectionType: 'cellular4g',
        });
      }
    }
    await installProbe(page, scenario);

    const response = await page.goto(new URL(scenario.path, baseUrl).href, {
      waitUntil: 'load',
      timeout: 60_000,
    });
    await page.waitForTimeout(1_000);

    const [pageMetrics, cdpMetrics, frameMetrics] = await Promise.all([
      page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const fcp = performance.getEntriesByName('first-contentful-paint')[0];
        const probe = window.__crimsonPerformance;
        const resources = performance.getEntriesByType('resource');
        return {
          domContentLoaded: navigation?.domContentLoadedEventEnd ?? 0,
          load: navigation?.loadEventEnd ?? 0,
          fcp: fcp?.startTime ?? 0,
          stateApplied: probe.stateApplied ?? 0,
          stateSettleDuration:
            probe.stateApplied !== null && probe.stateSettled !== null
              ? probe.stateSettled - probe.stateApplied
              : 0,
          cls: probe.cls,
          longTaskCount: probe.longTasks.length,
          longTaskDuration: probe.longTasks.reduce((total, task) => total + task.duration, 0),
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
      measureScrollFrames(page),
    ]);
    const metrics = cdpMetrics.metrics;
    samples.push({
      ...pageMetrics,
      ...frameMetrics,
      status: response?.status() ?? 0,
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
    });
    await context.close();
  }

  const keys = [
    'domContentLoaded',
    'load',
    'fcp',
    'stateApplied',
    'stateSettleDuration',
    'layoutDuration',
    'recalcStyleDuration',
    'scriptDuration',
    'taskDuration',
    'longTaskCount',
    'longTaskDuration',
    'cls',
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
    }
    browserResults.push({
      browserId,
      version: browser.version(),
      cdpMetrics: browserDefinition.cdp,
      cpuThrottling: browserDefinition.cdp ? cpuRate : 1,
      networkProfile: browserDefinition.cdp ? networkProfile : 'none',
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
  note: 'CPU、网络和 CDP 渲染指标只适用于 Chromium 系；跨引擎比较应使用 PERF_CPU_RATE=1 与 PERF_NETWORK_PROFILE=none。',
  browsers: browserResults,
};
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
