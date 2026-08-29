# BP-FND-CORE｜静态多页面内核

## 用户结果

无论附加模组是否启用，用户都能通过稳定 URL 打开、刷新和分享一个内容可读、导航可信、可静态部署的表站或里站页面。

## 边界

- 负责页面外壳、公开路由、根路径跳转、页面元数据、全局资源入口和无 JavaScript 的结构性降级；
- 为组件、内容、脚本和样式提供明确依赖方向；
- 消费本地化蓝图定义的 `routePrefix`，不自行维护国家版本矩阵；
- 不负责场次、剧目、搜索索引、档案污染或票务流程的业务规则；
- 不因假设性需求预建账号、后端、遥测或第三方运行时。

## 行为契约

- Astro 在构建期生成页面，浏览器交互使用原生 TypeScript 渐进增强；表站与里站使用独立路由和页面装配，不在同一个 HTML 中显隐整站；
- 根路径 `/` 不猜测浏览器语言，固定以替换当前历史记录的方式跳转至 `/yan/`；
- `routePrefix` 后的路由段使用稳定、非本地化的 ASCII 名称和统一尾斜杠：

```text
/{routePrefix}/
/{routePrefix}/performances/
/{routePrefix}/performances/history/
/{routePrefix}/performances/{performanceId}/
/{routePrefix}/productions/{productionId}/
/{routePrefix}/troupe/
/{routePrefix}/search/
/{routePrefix}/tickets/
/{routePrefix}/archive/site/1084-07-01/
/{routePrefix}/archive/site/1084-07-01/performances/
/{routePrefix}/archive/site/1084-07-01/performances/history/
/{routePrefix}/archive/site/1084-07-01/performances/{performanceId}/
/{routePrefix}/archive/site/1084-07-01/productions/{productionId}/
/{routePrefix}/archive/site/1084-07-01/troupe/
/{routePrefix}/archive/site/1084-07-01/search/
/{routePrefix}/archive/site/1084-07-01/tickets/
```

- 表站与里站均以各自首页为网站根路径；`performances/` 表示本季演出，`performances/history/` 表示历史演出，详情路径分别使用稳定的 `performanceId` 与 `productionId`；
- `/{routePrefix}/archive/site/1084/` 首页及同构合法深层路径只生成到上述日期快照规范路径的静态重定向；年份兼容路径不保留第二套正文，canonical 始终指向规范路径；
- 页面通过稳定内容 ID 建立跨国家版本对应关系，不根据翻译标题生成 URL；合法深层 URL 可以直接访问，不强制跳转至首页；
- 静态路径只遍历当前构建范围中的国家版本；国家版本注册、开发预览范围与正式发布范围由本地化契约分别拥有，页面、组件和验证不得维护平行版本数组；
- 只有 `/yan/` 允许被索引并进入站点地图。根路径只负责重定向，其他国家版本首页、全部表站内页和全部里站页面输出 `noindex,follow`；
- canonical 指向当前国家版本、当前世界和当前内容的稳定 URL；污染状态不进入 URL 或 canonical，`/yan/` 的 canonical 指向自身；
- JavaScript 失败时，表站和污染等级 `0` 的里站核心内容、主导航及返回路径仍可使用，不得留下无法关闭的全页覆盖层。

## 双时间层、内容与本地化

- 表站对外只表达叙事语义上的“现在”；内部网站时钟由 `BP-MOD-TERRA-TIME` 负责，当前固定预览值不要求显示，也不进入 URL；
- 当前唯一可访问里站快照的规范路由段为 `/archive/site/1084-07-01/`；稳定身份和完整捕获时间由 `BP-MOD-ARCHIVE` 的快照记录统一提供，其内部时钟始终固定，不受现实时间或污染影响；
- `archive` 只表示里站时间层，不承担“历史演出”栏目语义；
- 默认 `showcase` 生成炎国可部署预览；`preview` 生成本地化蓝图规定的当前严格预览集合；显式 `release` 只生成通过内容与发布门禁的正式范围。三者共用页面与内容解析入口，本蓝图不复制具体版本清单。

## Demo 基线

- 已发布国家版本可以构建、部署并通过稳定公开路由浏览；
- 表站与等级 `0` 里站的核心内容无需客户端脚本即可阅读；
- 表站与里站使用独立 HTML 页面树，深层 URL、根路径跳转和正常浏览器历史均成立。

## Formal 增量

- 建立上述表站与日期快照的静态页面树、旧年份路径重定向、直接访问、根跳转、统一元数据和站内链接；
- 将客户端装配改为按页面能力启用，使缺少无关模组 DOM 的页面仍可独立运行；
- 保持单一运行时内容源，不因多页面生成复制稳定数据。

## 验收

- 每个已发布 URL 可以直接打开、刷新、复制，并通过正常浏览器历史返回；
- 生成页面的 `lang`、canonical、robots、尾斜杠和站内链接符合当前国家版本与世界；
- `showcase`、`preview` 与 `release` 分别只生成各自构建快照范围内的页面，未知构建预设在页面生成前失败；
- 移除一个非核心客户端增强不会破坏两个网站等级 `0` 的阅读和导航；
- 构建产物不依赖 `docs/` 作为运行时输入，全局装配与依赖方向符合架构文档。
