# 猩红剧团概念网站

一个基于《明日方舟》世界观的非官方同人网站原型。设计问题是：

> 如果一位泰拉人搜索“猩红剧团”，会打开怎样的网站？

项目包含两个相互关联但独立浏览的时间层：

- **表站 / `front`：** 《红丝绒》事件后重新组建的新猩红剧团官网，时间定义为叙事语义上的“现在”，克制、现代、庄重且专业；
- **里站 / `archive`：** 泰拉历 1084 年旧剧团官网的历史快照，年代化、阴暗、怪异，并可以在浏览过程中逐级污染。

表站与里站共享工程基础，但使用独立 URL、页面装配和内容节奏，不是同一页面的明暗换肤。默认 `showcase` 构建炎国简体中文双站；九国家版本 `preview` 加入维多利亚、乌萨斯、叙拉古、米诺斯、莱塔尼亚、卡西米尔、东国与哥伦比亚等价页面。两种预览均包含独立场次与剧目、分域搜索、四级污染和表站模拟购票体验；页面数量由当前内容快照机械派生，不在说明文档写死。

## 运行

项目使用 Astro 7、TypeScript 6 和 Node.js 24 LTS。首次运行先安装依赖：

```bash
npm install
npm run dev
```

然后访问终端给出的本地地址。`npm run dev` 默认启动九国家版本开发预览，使国家版本选择器和跨版本状态可直接验证；只需炎国单版本时使用 `npm run dev:showcase`。日常开发使用 `npm run quality -- <本次改动路径...>`，只执行与实际变更有关的检查；不提供路径时自动读取工作区变更。`npm run build` 仍只生成单版本 `showcase` 的 `dist/`，不重复运行质量门禁。工具链变更、跨层集成、合并、发布和正式候选阶段使用 `npm run verify`，由它执行一次完整检查、关键状态验证、一次构建和静态产物验证。运行时输出变化后再使用 `npm run preview` 验收构建结果。

九版本 preview 构建后的默认浏览器冒烟为 `npm run validate:browser:preview`（Chromium）；需要品牌与跨引擎复核时，继续运行带 `:chrome`、`:firefox`、`:webkit` 与 `:edge` 后缀的同名命令。Playwright WebKit 是 Safari 的前置兼容代理，不等于真实 macOS Safari 验收。安装方式、品牌浏览器可执行文件覆盖和跨引擎性能取样参数见 [`docs/guides/development.md`](docs/guides/development.md)。

构建只使用三个命名预设：默认 `showcase` 构建炎国预览，`preview` 构建国家版本矩阵，`release` 只接受摘要匹配的人工批准内容。九版本开发使用 `npm run dev`，静态验收依次使用 `npm run build:preview` 与 `npm run validate:build:preview`；`npm run preview` 只服务最近一次生成的 `dist/`。发布资格由内容门禁报告，不在 README 保存批准现状。

## 正式产品边界

- 根路径 `/` 固定跳转至简体中文表站首页 `/yan/`；默认展示只生成炎国 `yan / zh-CN` 网站；
- 表站和里站均提供首页、本季演出、历史演出、剧团、搜索及次级票务页；里站规范路由位于 `/{routePrefix}/archive/site/1084-07-01/`，`1084` 年份路径只提供同构重定向；
- 国家版本使用独立 `editionId`、公开 `routePrefix` 和技术 locale。完整且已人工确认的矩阵只维护在 [`BP-I18N-CORE`](docs/blueprint/i18n/localization-contract.md)；
- `Performance` 表示一次具有日期、地点和有序剧目编排的完整场次，`Production` 表示可被多个场次复用的单独剧目。规范术语只维护在 [`BP-FND-DOMAIN`](docs/blueprint/foundation/domain-language.md)；
- 表站稳定票务页已启用模拟购票小游戏；无 JavaScript 或初始化失败时显示“暂未开票”降级内容。1084 里站当前全部场次不可购买；
- 只有 `/yan/` 允许索引；其他页面保持可直接访问，但输出 `noindex,follow`。

完整目标、阶段差距和验收条件以 [`docs/blueprint/`](docs/blueprint/README.md) 为准。

## 仓库结构

```text
├── docs/           # 架构、正式蓝图、作者资料、来源、研究、草稿和指南
├── scripts/        # 仓库维护和蓝图追踪工具，不进入浏览器产物
├── src/
│   ├── components/ # 可复用的 Astro 页面结构
│   ├── layouts/    # 页面外壳与公共元数据
│   ├── pages/      # Astro 文件路由入口
│   ├── assets/     # 拥有使用权的运行时静态资产
│   ├── data/       # 稳定领域事实、国家版本注册及分版本本地化内容包
│   ├── scripts/    # 搜索、筛选、污染与票务的渐进增强模块
│   └── styles/     # 共享基础、表站、里站、票务与污染的职责化样式
├── astro.config.ts # Astro 静态输出配置
├── package.json    # 唯一推荐的开发、质量检查和构建命令
├── AGENTS.md       # Agent 工作与验证规范
└── README.md
```

详细职责与当前到目标架构的过渡边界见 [`docs/architecture/repository-structure.md`](docs/architecture/repository-structure.md)，文档入口见 [`docs/README.md`](docs/README.md)。

功能开发前应先阅读 [`docs/blueprint/README.md`](docs/blueprint/README.md) 与领域语言蓝图。`npm run blueprint:where -- <源码路径>` 可从源码反查蓝图，`npm run blueprint:impact -- <蓝图 ID>` 可列出候选影响范围；两者只提供定位，不替代实现判断。

规划讨论、候选建议、创意草稿和一次性开发计划集中位于 [`docs/drafts/`](docs/drafts/README.md)。草稿不直接约束产品或源码；只有人工明确提出正式迁移后，才按影响定位拆入正式责任文件并删除已经迁移的草稿来源。一次性计划获得端到端自动执行授权后，技术决策由智能体在正式契约内完成，影响产品方向的选择仍由人工决定，具体边界见 [`docs/drafts/plans/README.md`](docs/drafts/plans/README.md)。

Git 工作分支、晋级方向、逐切片规则和人工门禁见 [`docs/guides/git-branch-workflow.md`](docs/guides/git-branch-workflow.md)。正式功能使用 `dev_feature_<slug>`，创意原型使用 `dev_experiment_<slug>`，未来专业通道也必须先回到 `dev_code`；唯一发布主干为 `dev_code -> dev -> main`。

## 当前实现阶段

当前候选包含表站与 1084 里站独立页面树、类型化领域数据、双站视觉、分域搜索、四级污染和模拟购票体验；所有消费者读取同一内容快照，基础内容在无 JavaScript 时仍可用。默认展示只生成 `yan / zh-CN`，其余八个国家版本用于未经过人工译审的技术预览。实现成熟度由蓝图追踪表记录，内容发布资格由批准摘要和 `release` 门禁决定。

官方来源、项目作者资料与研究分析分别从 [`docs/sources/`](docs/sources/README.md)、[`docs/project/`](docs/project/README.md) 和 [`docs/research/`](docs/research/README.md) 进入；文化机构网站的具体分析见 [`docs/research/design-and-service.md`](docs/research/design-and-service.md)。

## 版权说明

本项目为个人学习与同人创作概念，不代表《明日方舟》或其版权方。运行时使用了项目负责人确认的官方活页剧目标题与简体中文描述，以及依据本地授权参考重新实现的国家徽章轮廓；不直接打包游戏官方原始图片、视频、音频、字体或代码。其他视觉由项目原创 HTML/CSS、SVG 与生成图像构成，具体来源和权利边界见 [`docs/sources/`](docs/sources/README.md)。
