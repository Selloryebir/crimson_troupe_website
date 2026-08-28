#!/usr/bin/env node
/* global document, MutationObserver, requestAnimationFrame, window */

import { chromium } from 'playwright';

const stateKey = 'crimson-troupe:archive-pollution:v2';
const pendingKey = 'crimson-troupe:archive-navigation:v2';
const baseUrl = new URL(process.env.PERF_BASE_URL ?? 'http://127.0.0.1:4321');
const runs = Number.parseInt(process.env.PERF_RUNS ?? '5', 10);
const cpuRate = Number.parseInt(process.env.PERF_CPU_RATE ?? '4', 10);

if (!Number.isSafeInteger(runs) || runs < 1 || runs > 20) {
  throw new Error('PERF_RUNS 必须是 1 到 20 之间的整数');
}
if (!Number.isSafeInteger(cpuRate) || cpuRate < 1 || cpuRate > 20) {
  throw new Error('PERF_CPU_RATE 必须是 1 到 20 之间的整数');
}

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
  const values = samples.map((sample) => sample[key]);
  return {
    median: round(percentile(values, 0.5)),
    p95: round(percentile(values, 0.95)),
  };
}

function readMetric(metrics, name) {
  return metrics.find((metric) => metric.name === name)?.value ?? 0;
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

async function measureScenario(browser, scenario) {
  const samples = [];
  for (let run = 0; run < runs; run += 1) {
    const context = await browser.newContext({ viewport: viewports[scenario.viewport] });
    const page = await context.newPage();
    const client = await context.newCDPSession(page);
    await client.send('Performance.enable');
    await client.send('Emulation.setCPUThrottlingRate', { rate: cpuRate });
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: (1_600_000 / 8) * 0.9,
      uploadThroughput: (750_000 / 8) * 0.9,
      connectionType: 'cellular4g',
    });
    await installProbe(page, scenario);

    const response = await page.goto(new URL(scenario.path, baseUrl).href, {
      waitUntil: 'load',
      timeout: 60_000,
    });
    await page.waitForTimeout(1_000);

    const [pageMetrics, cdpMetrics] = await Promise.all([
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
        };
      }),
      client.send('Performance.getMetrics'),
    ]);
    const metrics = cdpMetrics.metrics;
    samples.push({
      ...pageMetrics,
      status: response?.status() ?? 0,
      layoutDuration: readMetric(metrics, 'LayoutDuration') * 1_000,
      recalcStyleDuration: readMetric(metrics, 'RecalcStyleDuration') * 1_000,
      scriptDuration: readMetric(metrics, 'ScriptDuration') * 1_000,
      taskDuration: readMetric(metrics, 'TaskDuration') * 1_000,
      jsHeapUsed: readMetric(metrics, 'JSHeapUsedSize'),
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

const browser = await chromium.launch({ headless: true });
try {
  const results = [];
  for (const scenario of scenarios) {
    results.push(await measureScenario(browser, scenario));
  }
  const report = {
    baseUrl: baseUrl.href,
    runs,
    cpuRate,
    network: '1.6 Mbps down / 750 Kbps up / 150 ms RTT',
    results,
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} finally {
  await browser.close();
}
