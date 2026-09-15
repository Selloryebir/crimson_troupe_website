#!/usr/bin/env node

import assert from 'node:assert/strict';
import { fork } from 'node:child_process';
import { createHash } from 'node:crypto';
import { once } from 'node:events';
import { readFile, utimes } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

import { dev } from 'astro';
import { chromium } from 'playwright';

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url));

// 仅 pageerror 无法发现被 Astro 捕获的服务端 HMR 错误，故捕获独立进程日志。
if (process.argv.includes('--server')) {
  const server = await dev({
    root: repositoryRoot,
    server: { host: '127.0.0.1', port: 0 },
  });
  process.send({ ready: true, port: server.address.port });
  process.once('message', async () => {
    await server.stop();
    process.disconnect();
  });
} else {
  const child = fork(fileURLToPath(import.meta.url), ['--server'], {
    cwd: repositoryRoot,
    stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
  });
  let logs = '';
  for (const stream of [child.stdout, child.stderr]) {
    stream.on('data', (chunk) => {
      logs += chunk.toString();
    });
  }
  const paths = [
    'src/styles/front.css',
    'src/styles/archive.css',
    'src/components/archive/ArchivePoster.astro',
  ];
  const digest = async (path) =>
    createHash('sha256')
      .update(await readFile(new URL(`../${path}`, import.meta.url)))
      .digest('hex');
  const initialDigests = await Promise.all(paths.map(digest));
  let browser;
  try {
    const [ready] = await once(child, 'message', { signal: AbortSignal.timeout(30_000) });
    assert.equal(ready.ready, true);
    const origin = `http://127.0.0.1:${ready.port}`;
    browser = await chromium.launch();
    const page = await browser.newPage();
    const browserErrors = [];
    const updates = [];
    page.on('pageerror', (error) => browserErrors.push(error.message));
    page.on('websocket', (socket) => {
      socket.on('framereceived', ({ payload }) => {
        const message = JSON.parse(payload.toString());
        if (['update', 'full-reload'].includes(message.type)) updates.push(message);
        if (message.type === 'error') browserErrors.push(JSON.stringify(message.err));
      });
    });
    const routes = ['/yan/', '/yan/archive/site/1084-07-01/'];
    for (const route of routes) {
      const response = await page.goto(origin + route);
      assert.equal(response.status(), 200);
      await page.locator('main h1').waitFor();
    }
    for (let round = 0; round < 3; round += 1) {
      const previousUpdates = updates.length;
      // 不重写用户源码，只通过修改时间触发同内容保存对应的热更新事件。
      const now = new Date();
      for (const path of paths) await utimes(new URL(`../${path}`, import.meta.url), now, now);
      for (let attempt = 0; attempt < 50 && updates.length === previousUpdates; attempt += 1) {
        await delay(100);
      }
      assert.ok(updates.length > previousUpdates, `第 ${round + 1} 轮未收到真实 HMR 消息`);
      await delay(1000);
      for (const route of routes) {
        const response = await page.goto(origin + route);
        assert.equal(response.status(), 200);
        await page.locator('main h1').waitFor();
      }
    }
    assert.doesNotMatch(logs, /Failed to update routes via HMR|\[ERROR\]|TypeError:/);
    assert.deepEqual(browserErrors, []);
    assert.deepEqual(await Promise.all(paths.map(digest)), initialDigests, '源码内容不得变化');
    console.log(
      `dev HMR validation passed: 3 rounds, ${updates.length} browser updates, no server/browser errors; source hashes unchanged`,
    );
  } catch (error) {
    console.error(logs);
    throw error;
  } finally {
    await browser?.close();
    if (child.exitCode === null && child.signalCode === null) {
      const stopped = once(child, 'exit');
      if (child.connected) child.send({ stop: true });
      const timeout = setTimeout(() => child.kill('SIGTERM'), 5000);
      await stopped;
      clearTimeout(timeout);
    }
  }
}
