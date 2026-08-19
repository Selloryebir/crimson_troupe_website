#!/usr/bin/env node

import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildProfile, builtEditions } from '../src/data/editions.ts';
import { getLocalization } from '../src/data/localized/resolve.ts';
import { performanceEntries } from '../src/data/performances.ts';
import { productionEntries } from '../src/data/productions.ts';
import { performancePath, productionPath, sitePath, siteRoot } from '../src/data/site-routes.ts';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = path.join(repositoryRoot, 'dist');

function requiredRoutesForEdition(edition) {
  const routes = new Set([
    siteRoot(edition, 'front'),
    sitePath(edition, 'front', 'performances'),
    sitePath(edition, 'front', 'performances/history'),
    sitePath(edition, 'front', 'troupe'),
    sitePath(edition, 'front', 'search'),
    sitePath(edition, 'front', 'tickets'),
    siteRoot(edition, 'archive'),
    sitePath(edition, 'archive', 'performances'),
    sitePath(edition, 'archive', 'performances/history'),
    sitePath(edition, 'archive', 'troupe'),
    sitePath(edition, 'archive', 'search'),
    sitePath(edition, 'archive', 'tickets'),
  ]);
  for (const [performanceId, performance] of performanceEntries) {
    routes.add(performancePath(edition, performance.world, performanceId));
  }
  for (const [productionId] of productionEntries) {
    const frontUsesProduction = performanceEntries.some(
      ([, performance]) =>
        performance.world === 'front' && performance.productionIds.includes(productionId),
    );
    const archiveUsesProduction = performanceEntries.some(
      ([, performance]) =>
        performance.world === 'archive' && performance.productionIds.includes(productionId),
    );
    if (frontUsesProduction) {
      routes.add(productionPath(edition, 'front', productionId));
    }
    if (archiveUsesProduction) {
      routes.add(productionPath(edition, 'archive', productionId));
    }
  }
  return routes;
}

const requiredRoutes = new Set(['/']);
for (const edition of builtEditions) {
  for (const route of requiredRoutesForEdition(edition)) {
    requiredRoutes.add(route);
  }
}

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

function editionForRoute(route) {
  return builtEditions.find((edition) => route.startsWith(`/${edition.routePrefix}/`));
}

assert.ok(existsSync(outputRoot), 'dist/ 不存在；请先运行同模式构建');
const outputFiles = walk(outputRoot);
const htmlFiles = outputFiles.filter((filePath) => filePath.endsWith('.html'));
const routes = new Map(htmlFiles.map((filePath) => [routeForHtml(filePath), filePath]));
assert.equal(routes.size, requiredRoutes.size, 'HTML 页面数量与当前构建集合不一致');
for (const route of requiredRoutes) {
  assert.ok(routes.has(route), `缺少必需路由：${route}`);
}

let linkCount = 0;
for (const [route, filePath] of routes) {
  const html = readFileSync(filePath, 'utf8');
  const edition = editionForRoute(route);
  const expectedLocale = edition?.locale ?? 'zh-CN';
  assert.match(
    html,
    new RegExp(`<html\\s[^>]*lang="${expectedLocale}"`, 'u'),
    `${route} 的 lang 不正确`,
  );

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
    assert.match(html, /<nav\s+class="main-nav"/u, `${route} 缺少主导航`);
    const localization = getLocalization(edition);
    assert.ok(html.includes(localization.site.shared.fanNotice), `${route} 缺少统一页脚声明`);
    if (builtEditions.length > 1) {
      assert.match(html, /<details[^>]*data-edition-selector/u, `${route} 缺少国家版本选择器`);
      for (const targetEdition of builtEditions) {
        const equivalent = `/${targetEdition.routePrefix}/${route.split('/').slice(2).join('/')}`;
        assert.ok(html.includes(`href="${equivalent}"`), `${route} 缺少等价版本链接 ${equivalent}`);
      }
    } else {
      assert.doesNotMatch(html, /<details[^>]*data-edition-selector/u, `${route} 不应显示空选择器`);
    }
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

for (const edition of builtEditions) {
  const frontRoute = sitePath(edition, 'front', 'search');
  const archiveRoute = sitePath(edition, 'archive', 'search');
  const frontSearch = readSearchIndex(frontRoute);
  const archiveSearch = readSearchIndex(archiveRoute);
  assert.ok(frontSearch.length > 0 && archiveSearch.length > 0);
  assert.ok(
    frontSearch.every(
      (entry) =>
        entry.href.startsWith(`/${edition.routePrefix}/`) &&
        !entry.href.includes('/archive/site/1091/'),
    ),
    `${edition.editionId} 表站搜索索引发生跨范围泄漏`,
  );
  assert.ok(
    archiveSearch.every((entry) =>
      entry.href.startsWith(`/${edition.routePrefix}/archive/site/1091/`),
    ),
    `${edition.editionId} 里站搜索索引发生跨范围泄漏`,
  );

  const ticketPage = readFileSync(routes.get(sitePath(edition, 'front', 'tickets')), 'utf8');
  assert.match(ticketPage, /data-ticket-fallback/u);
  assert.match(ticketPage, /data-ticketing-app[^>]*hidden/u);
  assert.match(ticketPage, /data-ticketing-messages/u);
  const archiveTicketPage = readFileSync(
    routes.get(sitePath(edition, 'archive', 'tickets')),
    'utf8',
  );
  assert.doesNotMatch(archiveTicketPage, /data-ticketing-app/u);
}

for (const filePath of outputFiles.filter((entry) => entry.endsWith('.js'))) {
  const source = readFileSync(filePath, 'utf8');
  assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(/u, '产物包含远端请求入口');
  assert.doesNotMatch(source, /pollution-debug|data-pollution-debug/u, '产物包含污染调试入口');
}

console.log(
  `build validation passed: profile=${buildProfile}, html=${htmlFiles.length}, links=${linkCount}, editions=${builtEditions.length}`,
);
