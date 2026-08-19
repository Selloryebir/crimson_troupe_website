#!/usr/bin/env node

import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = path.join(repositoryRoot, 'dist');
const requiredRoutes = new Set([
  '/',
  '/yan/',
  '/yan/performances/',
  '/yan/performances/history/',
  '/yan/troupe/',
  '/yan/search/',
  '/yan/tickets/',
  '/yan/archive/site/1091/',
  '/yan/archive/site/1091/performances/',
  '/yan/archive/site/1091/performances/history/',
  '/yan/archive/site/1091/troupe/',
  '/yan/archive/site/1091/search/',
  '/yan/archive/site/1091/tickets/',
]);

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

function routeForHtml(filePath) {
  const relative = path.relative(outputRoot, filePath).split(path.sep).join('/');
  if (relative === 'index.html') {
    return '/';
  }
  assert.ok(relative.endsWith('/index.html'), `不支持的 HTML 输出形式：${relative}`);
  return `/${relative.slice(0, -'index.html'.length)}`;
}

function outputPathForUrl(pathname) {
  if (pathname === '/') {
    return path.join(outputRoot, 'index.html');
  }
  if (pathname.endsWith('/')) {
    return path.join(outputRoot, pathname.slice(1), 'index.html');
  }
  return path.join(outputRoot, pathname.slice(1));
}

function decodeHtmlAttribute(value) {
  return value
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&#x27;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');
}

assert.ok(existsSync(outputRoot), 'dist/ 不存在；请先运行构建');
const outputFiles = walk(outputRoot);
const htmlFiles = outputFiles.filter((filePath) => filePath.endsWith('.html'));
const routes = new Map(htmlFiles.map((filePath) => [routeForHtml(filePath), filePath]));
for (const route of requiredRoutes) {
  assert.ok(routes.has(route), `缺少必需路由：${route}`);
}
assert.ok([...routes].every(([route]) => route === '/' || route.startsWith('/yan/')));

let linkCount = 0;
for (const [route, filePath] of routes) {
  const html = readFileSync(filePath, 'utf8');
  assert.match(html, /<html\s[^>]*lang="zh-CN"/u, `${route} 的 lang 不正确`);

  const robots = html.match(/<meta\s+name="robots"\s+content="([^"]+)"/u)?.[1];
  const expectedRobots = route === '/yan/' ? 'index,follow' : 'noindex,follow';
  assert.equal(robots, expectedRobots, `${route} 的 robots 不正确`);

  const ids = [...html.matchAll(/\sid="([^"]+)"/gu)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${route} 存在重复 ID`);

  if (route === '/') {
    assert.match(html, /http-equiv="refresh"[^>]+\/yan\//u);
    assert.match(html, /location\.replace\([^)]*destination/u);
  } else {
    const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/u)?.[1];
    assert.equal(canonical, route, `${route} 的 canonical 不正确`);
    assert.ok(html.includes('id="main-content"'), `${route} 缺少正文入口`);
    assert.ok(html.includes('aria-label="主导航"'), `${route} 缺少主导航`);
    assert.ok(html.includes('非官方同人概念站'), `${route} 缺少统一页脚声明`);
  }

  for (const match of html.matchAll(/\shref="([^"]+)"/gu)) {
    const href = decodeHtmlAttribute(match[1]);
    if (href.startsWith('#')) {
      assert.ok(ids.includes(href.slice(1)), `${route} 的页内链接目标不存在：${href}`);
      continue;
    }
    if (!href.startsWith('/')) {
      continue;
    }
    const target = new URL(href, 'https://candidate.invalid');
    assert.ok(existsSync(outputPathForUrl(target.pathname)), `${route} 存在断链：${href}`);
    linkCount += 1;
  }

  for (const match of html.matchAll(/\ssrc="([^"]+)"/gu)) {
    const source = decodeHtmlAttribute(match[1]);
    if (!source.startsWith('/')) {
      continue;
    }
    const target = new URL(source, 'https://candidate.invalid');
    assert.ok(existsSync(outputPathForUrl(target.pathname)), `${route} 缺少本地资源：${source}`);
  }

  assert.doesNotMatch(
    html,
    /<(?:script|img|source|video|audio)[^>]+\bsrc="https?:\/\//iu,
    `${route} 加载了远端运行时资源`,
  );
  assert.doesNotMatch(
    html,
    /<link[^>]+rel="stylesheet"[^>]+href="https?:\/\//iu,
    `${route} 加载了远端样式`,
  );
}

function readSearchIndex(route) {
  const html = readFileSync(routes.get(route), 'utf8');
  const encoded = html.match(/data-search-index="([^"]+)"/u)?.[1];
  assert.ok(encoded, `${route} 缺少构建期搜索索引`);
  return JSON.parse(decodeHtmlAttribute(encoded));
}

const frontSearch = readSearchIndex('/yan/search/');
const archiveSearch = readSearchIndex('/yan/archive/site/1091/search/');
assert.ok(frontSearch.length > 0 && archiveSearch.length > 0);
assert.ok(
  frontSearch.every(
    (entry) => entry.href.startsWith('/yan/') && !entry.href.includes('/archive/site/1091/'),
  ),
  '表站搜索索引发生跨世界泄漏',
);
assert.ok(
  archiveSearch.every((entry) => entry.href.startsWith('/yan/archive/site/1091/')),
  '里站搜索索引发生跨世界泄漏',
);

const ticketPage = readFileSync(routes.get('/yan/tickets/'), 'utf8');
assert.match(ticketPage, /data-ticket-fallback/u);
assert.match(ticketPage, /data-ticketing-app[^>]*hidden/u);
const archiveTicketPage = readFileSync(routes.get('/yan/archive/site/1091/tickets/'), 'utf8');
assert.ok(archiveTicketPage.includes('原席位登记已经终止'));
assert.ok(archiveTicketPage.includes('不会建立票篮'));
assert.doesNotMatch(archiveTicketPage, /data-ticketing-app/u);

for (const filePath of outputFiles.filter((entry) => entry.endsWith('.js'))) {
  const source = readFileSync(filePath, 'utf8');
  assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(/u, '产物包含远端请求入口');
  assert.doesNotMatch(source, /pollution-debug|data-pollution-debug/u, '产物包含污染调试入口');
}

console.log(
  `build validation passed: html=${htmlFiles.length}, links=${linkCount}, frontSearch=${frontSearch.length}, archiveSearch=${archiveSearch.length}`,
);
