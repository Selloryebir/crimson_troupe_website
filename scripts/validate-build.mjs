#!/usr/bin/env node

import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { archiveSnapshots, currentArchiveSnapshot } from '../src/data/archive-snapshots.ts';
import { getArchiveSeatRegisterEntries } from '../src/data/archive-ticketing.ts';
import { buildSnapshot, getWorldProductionIds } from '../src/data/content/resolve.ts';
import { buildProfile } from '../src/data/editions.ts';
import { formatMessage } from '../src/data/localized/format.ts';
import { getLocalization } from '../src/data/localized/resolve.ts';
import {
  getArchiveSearchIndex,
  getFrontSearchIndex,
  getSiteSearchScope,
} from '../src/data/site-search-index.ts';
import {
  legacyArchiveSitePath,
  legacyArchiveSiteRoot,
  performancePath,
  productionPath,
  sitePath,
  siteRoot,
} from '../src/data/site-routes.ts';
import { getTicketingOptions } from '../src/data/ticketing.ts';

const { editions: builtEditions, performanceEntries, productionEntries } = buildSnapshot;

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = path.join(repositoryRoot, 'dist');
const remoteHtmlAutoLoadPatterns = [
  /<(?:script|img|source|video|audio|iframe|embed)\b[^>]*\b(?:src|srcset)=["'][^"']*https?:\/\//iu,
  /<object\b[^>]*\bdata=["'][^"']*https?:\/\//iu,
];
const remoteCssAutoLoadPatterns = [
  /url\(\s*["']?https?:\/\//iu,
  /@import\s+(?:url\(\s*)?["']?https?:\/\//iu,
];
const remoteScriptRequestPatterns = [
  /\bfetch\s*\(/u,
  /\bnew\s+(?:XMLHttpRequest|WebSocket|EventSource)\s*\(/u,
  /\b(?:navigator\s*\.\s*)?sendBeacon\s*\(/u,
];

function assertNoMatchFrom(source, patterns, message) {
  for (const pattern of patterns) {
    assert.doesNotMatch(source, pattern, message);
  }
}

assertNoMatchFrom(
  '<a href="https://example.invalid/reference">ordinary external navigation</a>',
  remoteHtmlAutoLoadPatterns,
  '普通外部导航不应被识别为远端自动载入',
);
assert.throws(
  () => assertNoMatchFrom('navigator.sendBeacon("/event")', remoteScriptRequestPatterns, 'fixture'),
  /fixture/u,
);
assert.throws(
  () =>
    assertNoMatchFrom(
      'body{background:url(https://example.invalid/a)}',
      remoteCssAutoLoadPatterns,
      'fixture',
    ),
  /fixture/u,
);

function requiredRoutesForEdition(edition) {
  const routes = new Set([
    siteRoot(edition, 'front'),
    sitePath(edition, 'front', 'performances'),
    sitePath(edition, 'front', 'performances/history'),
    sitePath(edition, 'front', 'troupe'),
    sitePath(edition, 'front', 'search'),
    sitePath(edition, 'front', 'tickets'),
    sitePath(edition, 'front', 'tickets/partner'),
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
const legacyRedirects = new Map();
for (const edition of builtEditions) {
  for (const route of requiredRoutesForEdition(edition)) {
    requiredRoutes.add(route);
  }
  const editionLegacyRedirects = [
    [legacyArchiveSiteRoot(edition), siteRoot(edition, 'archive')],
    [legacyArchiveSitePath(edition, 'performances'), sitePath(edition, 'archive', 'performances')],
    [
      legacyArchiveSitePath(edition, 'performances/history'),
      sitePath(edition, 'archive', 'performances/history'),
    ],
    [legacyArchiveSitePath(edition, 'troupe'), sitePath(edition, 'archive', 'troupe')],
    [legacyArchiveSitePath(edition, 'search'), sitePath(edition, 'archive', 'search')],
    [legacyArchiveSitePath(edition, 'tickets'), sitePath(edition, 'archive', 'tickets')],
  ];
  for (const [performanceId, performance] of performanceEntries) {
    if (performance.world === 'archive') {
      editionLegacyRedirects.push([
        legacyArchiveSitePath(edition, `performances/${performanceId}`),
        performancePath(edition, 'archive', performanceId),
      ]);
    }
  }
  for (const productionId of getWorldProductionIds(buildSnapshot, 'archive')) {
    editionLegacyRedirects.push([
      legacyArchiveSitePath(edition, `productions/${productionId}`),
      productionPath(edition, 'archive', productionId),
    ]);
  }
  for (const [legacyRoute, canonicalRoute] of editionLegacyRedirects) {
    requiredRoutes.add(legacyRoute);
    legacyRedirects.set(legacyRoute, canonicalRoute);
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
  const redirectTarget = legacyRedirects.get(route);
  if (redirectTarget) {
    assert.match(
      html,
      new RegExp(`http-equiv=["']refresh["'][^>]+${redirectTarget.replaceAll('/', '\\/')}`, 'iu'),
      `${route} 没有静态重定向到 ${redirectTarget}`,
    );
    assert.doesNotMatch(html, /id="main-content"/u, `${route} 不应保留第二份历史快照正文`);
    continue;
  }
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
      assert.ok(
        html.includes(
          formatMessage(localization.site.shared.chooseEdition, {
            language: edition.languageName.native,
          }),
        ),
        `${route} 的国家版本选择器未读出当前版本与选择动作`,
      );
    } else {
      assert.doesNotMatch(html, /<details[^>]*data-edition-selector/u, `${route} 不应显示空选择器`);
    }
    const isArchiveRoute = route.startsWith(siteRoot(edition, 'archive'));
    if (isArchiveRoute) {
      assert.doesNotMatch(html, /class="archive-catalog"/u, `${route} 不应重复显示表站馆藏索引`);
      assert.match(html, /data-world-switch="front"/u, `${route} 缺少可靠的表站返回入口`);
    } else {
      assert.match(html, /class="archive-catalog"/u, `${route} 缺少低干扰馆藏索引`);
      assert.match(
        html,
        new RegExp(`href="${siteRoot(edition, 'archive').replaceAll('/', '\\/')}"`, 'u'),
        `${route} 缺少当前快照入口`,
      );
      for (const snapshot of archiveSnapshots) {
        assert.ok(
          html.includes(snapshot.displayCapturedAt),
          `${route} 缺少馆藏记录 ${snapshot.snapshotId}`,
        );
      }
      assert.doesNotMatch(
        html,
        /href="[^"]*\/archive\/site\/(?:1093|1096)/u,
        `${route} 不得把损坏快照渲染为链接`,
      );
    }
    if (isArchiveRoute) {
      assert.match(
        html,
        /<div class="archive-pollution-stage" data-pollution-visual-layer aria-hidden="true">/u,
        `${route} 缺少退出语义树的污染装饰层`,
      );
      assert.ok(
        html.indexOf('<h1') < html.indexOf('data-archive-invitation'),
        `${route} 的主标题必须先于三级邀请`,
      );
      assert.match(
        html,
        /data-pollution-status[^>]*data-pollution-announcement-level1[^>]*data-pollution-announcement-level2[^>]*data-pollution-announcement-level3[^>]*aria-live="polite"/u,
        `${route} 缺少三级本地化污染状态公告`,
      );
      assert.doesNotMatch(
        html,
        /data-archive-invitation-status|data-invitation-announcement/u,
        `${route} 的请柬不得拥有独立 live 公告`,
      );
      assert.doesNotMatch(
        html,
        /<dialog[^>]*data-archive-invitation[^>]*\sopen(?:\s|>)/u,
        `${route} 不得在静态产物中自动打开邀请`,
      );
      assert.doesNotMatch(
        html,
        /<section[^>]*\sdata-archive-projection(?:\s|=|>)|data-archive-projection-status/u,
        `${route} 不得保留底部投影框`,
      );
      const projectionPosters = [
        ...html.matchAll(/<img\b[^>]*data-archive-projection-field="poster"[^>]*>/gu),
      ];
      for (const [projectionPoster] of projectionPosters) {
        assert.match(projectionPoster, /\sloading="lazy"/u, `${route} 的隐藏投影图必须延迟加载`);
        assert.doesNotMatch(
          projectionPoster,
          /\sloading="eager"/u,
          `${route} 的等级 0 不得急切请求隐藏投影图`,
        );
      }
    }
    if (route.endsWith('/search/')) {
      assert.match(html, /data-search-fallback/u, `${route} 缺少唯一搜索降级内容`);
      assert.match(html, /data-search-enhanced[^>]*hidden/u, `${route} 搜索不应默认伪启用`);
      assert.doesNotMatch(html, /<noscript>/u, `${route} 不应重复输出第二份搜索降级内容`);
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

  assertNoMatchFrom(html, remoteHtmlAutoLoadPatterns, `${route} 加载了远端运行时资源`);
  assertNoMatchFrom(html, remoteCssAutoLoadPatterns, `${route} 内联样式加载了远端资源`);
  for (const linkTag of html.matchAll(/<link\b[^>]*>/giu)) {
    const rel = linkTag[0].match(/\brel=["']([^"']+)["']/iu)?.[1] ?? '';
    const href = linkTag[0].match(/\bhref=["']([^"']+)["']/iu)?.[1] ?? '';
    const autoLoadRelation = rel
      .split(/\s+/u)
      .find((token) => /^(?:stylesheet|preload|modulepreload|icon|manifest)$/iu.test(token));
    if (autoLoadRelation) {
      assert.doesNotMatch(
        href,
        /^https?:\/\//iu,
        `${route} 的 ${autoLoadRelation} 链接自动载入远端资源`,
      );
    }
  }
}

function readSearchIndex(route) {
  const html = readFileSync(routes.get(route), 'utf8');
  const encoded = html.match(/data-search-index="([^"]+)"/u)?.[1];
  assert.ok(encoded, `${route} 缺少构建期搜索索引`);
  return JSON.parse(decodeHtmlAttribute(encoded));
}

function readSearchScope(route) {
  const html = readFileSync(routes.get(route), 'utf8');
  const scope = html.match(/data-search-scope="([^"]+)"/u)?.[1];
  assert.ok(scope, `${route} 缺少搜索范围身份`);
  return decodeHtmlAttribute(scope);
}

for (const edition of builtEditions) {
  const frontRoute = sitePath(edition, 'front', 'search');
  const archiveRoute = sitePath(edition, 'archive', 'search');
  const frontSearch = readSearchIndex(frontRoute);
  const archiveSearch = readSearchIndex(archiveRoute);
  assert.deepEqual(frontSearch, getFrontSearchIndex(edition, buildSnapshot));
  assert.deepEqual(archiveSearch, getArchiveSearchIndex(edition, buildSnapshot));
  assert.equal(readSearchScope(frontRoute), getSiteSearchScope(edition, 'front'));
  assert.equal(readSearchScope(archiveRoute), getSiteSearchScope(edition, 'archive'));
  assert.ok(frontSearch.length > 0 && archiveSearch.length > 0);
  assert.ok(
    frontSearch.every(
      (entry) =>
        entry.href.startsWith(`/${edition.routePrefix}/`) &&
        !entry.href.startsWith(siteRoot(edition, 'archive')),
    ),
    `${edition.editionId} 表站搜索索引发生跨范围泄漏`,
  );
  assert.ok(
    archiveSearch.every((entry) => entry.href.startsWith(siteRoot(edition, 'archive'))),
    `${edition.editionId} 里站搜索索引发生跨范围泄漏`,
  );

  const ticketPage = readFileSync(routes.get(sitePath(edition, 'front', 'tickets')), 'utf8');
  assert.match(ticketPage, /data-ticket-fallback/u);
  assert.match(ticketPage, /data-ticketing-app[^>]*hidden/u);
  assert.match(ticketPage, /data-ticketing-messages/u);
  assert.match(ticketPage, /data-ticket-basket[^>]*aria-labelledby="ticket-basket-title"/u);
  assert.match(ticketPage, /data-ticket-flow[^>]*aria-labelledby="ticket-flow-title"/u);
  assert.match(ticketPage, /data-ticket-result[^>]*aria-labelledby="ticket-result-title"/u);
  const encodedTicketOptions = ticketPage.match(/data-ticketing-options="([^"]+)"/u)?.[1];
  assert.ok(encodedTicketOptions, `${edition.editionId} 票务页缺少构建期候选`);
  const ticketOptions = JSON.parse(decodeHtmlAttribute(encodedTicketOptions));
  const expectedTicketOptions = JSON.parse(
    JSON.stringify(getTicketingOptions(getLocalization(edition), buildSnapshot)),
  );
  assert.deepEqual(ticketOptions, expectedTicketOptions);
  const archiveTicketPage = readFileSync(
    routes.get(sitePath(edition, 'archive', 'tickets')),
    'utf8',
  );
  const archiveSeatEntries = getArchiveSeatRegisterEntries(getLocalization(edition), buildSnapshot);
  assert.match(archiveTicketPage, /class="[^"]*\barchive-seat-register\b/u);
  assert.equal(
    [...archiveTicketPage.matchAll(/<select\b/gu)].length,
    archiveSeatEntries.length,
    `${edition.editionId} 里站静态席位场次数量不正确`,
  );
  assert.match(
    archiveTicketPage,
    /<button\b[^>]*\bdisabled\b[^>]*aria-describedby="archive-settlement-status"/u,
    `${edition.editionId} 里站结算控件必须在无脚本产物中真实失活`,
  );
  assert.doesNotMatch(
    archiveTicketPage,
    /data-ticket(?:ing-app|-basket|-flow|-result|-fallback|-options|-messages)/u,
    `${edition.editionId} 里站席位页不得接入表站票务状态机`,
  );
  assert.doesNotMatch(archiveTicketPage, /class="issued-ticket"|\bdownload=/u);
}

assert.equal(
  currentArchiveSnapshot.snapshotId,
  '1084-07-01T00:00:00',
  '当前可访问快照身份发生漂移',
);
for (const snapshot of archiveSnapshots) {
  if (snapshot.state === 'damaged') {
    const damagedYear = snapshot.displayCapturedAt.slice(0, 4);
    assert.equal(
      [...routes.keys()].some((route) => route.includes(`/archive/site/${damagedYear}`)),
      false,
      `损坏快照 ${snapshot.snapshotId} 不得生成页面`,
    );
  }
}

for (const filePath of outputFiles.filter((entry) => entry.endsWith('.css'))) {
  const source = readFileSync(filePath, 'utf8');
  assertNoMatchFrom(source, remoteCssAutoLoadPatterns, `${filePath} 加载了远端 CSS 资源`);
}

for (const filePath of outputFiles.filter((entry) => entry.endsWith('.js'))) {
  const source = readFileSync(filePath, 'utf8');
  assertNoMatchFrom(source, remoteScriptRequestPatterns, `${filePath} 包含远端请求入口`);
  assert.doesNotMatch(source, /pollution-debug|data-pollution-debug/u, '产物包含污染调试入口');
}

console.log(
  `build validation passed: profile=${buildProfile}, html=${htmlFiles.length}, links=${linkCount}, editions=${builtEditions.length}`,
);
