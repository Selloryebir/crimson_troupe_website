# 猩红剧团概念网站

一个基于《明日方舟》世界观的非官方同人网站原型。设计问题是：

> 如果一位泰拉人搜索“猩红剧团”，会打开怎样的网站？

项目包含两个相互关联但独立浏览的时间层：

- **表站 / `front`：** 《红丝绒》事件后重新组建的新猩红剧团官网，时间定义为叙事语义上的“现在”，克制、现代、庄重且专业；
- **里站 / `archive`：** 泰拉历 1084 年旧剧团官网的历史快照，年代化、阴暗、怪异，并可以在浏览过程中逐级污染。

表站与里站共享工程基础，但使用独立 URL、页面装配和内容节奏，不是同一页面的明暗换肤。默认 `showcase` 当前生成 51 个静态页面（含根路径入口与炎国简体中文双站）；九国家版本 `preview` 生成 451 个页面，加入维多利亚、乌萨斯、叙拉古、米诺斯、莱塔尼亚、卡西米尔、东国与哥伦比亚等价页面。两种预览构建均包含独立场次与剧目、分域搜索、四级污染和表站模拟购票体验。

## 运行

项目使用 Astro 7、TypeScript 6 和 Node.js 24 LTS。首次运行先安装依赖：

```bash
npm install
npm run dev
```

然后访问终端给出的本地地址。日常开发使用 `npm run quality -- <本次改动路径...>`，只执行与实际变更有关的检查；不提供路径时自动读取工作区变更。`npm run build` 只生成 `dist/`，不重复运行质量门禁。工具链变更、跨层集成、合并、发布和正式候选阶段使用 `npm run verify`，由它执行一次完整检查、关键状态验证、一次构建和静态产物验证。运行时输出变化后再使用 `npm run preview` 验收构建结果。

构建只使用三个命名预设：默认 `showcase` 构建炎国未批准预览，`preview` 构建国家版本矩阵内九个版本的未批准预览，`release` 只接受已经人工批准的正式内容。需要检查九国家版本架构时，使用 `npm run dev:preview` 或 `npm run build:preview`；构建后使用 `npm run validate:build:preview` 检查 451 个页面的路由、元数据和搜索隔离。当前全部运行时内容均未获正式批准，因此 `npm run build:release` 会列出不合格稳定 ID 并按预期停止，不应以 `release` 代替日常预览。

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
├── docs/           # 架构、正式蓝图、临时草稿、指南和外部参考
├── scripts/        # 仓库维护和蓝图追踪工具，不进入浏览器产物
├── src/
│   ├── components/ # 可复用的 Astro 页面结构
│   ├── layouts/    # 页面外壳与公共元数据
│   ├── pages/      # Astro 文件路由入口
│   ├── assets/     # 拥有使用权的运行时静态资产
│   ├── data/       # 稳定领域事实、国家版本注册及分版本本地化内容包
│   └── styles/     # 共享基础、表站、里站、票务与污染的职责化样式
├── astro.config.ts # Astro 静态输出配置
├── package.json    # 唯一推荐的开发、质量检查和构建命令
├── AGENTS.md       # Agent 工作与验证规范
└── README.md
```

详细职责与当前到目标架构的过渡边界见 [`docs/architecture/repository-structure.md`](docs/architecture/repository-structure.md)，文档入口见 [`docs/README.md`](docs/README.md)。

功能开发前应先阅读 [`docs/blueprint/README.md`](docs/blueprint/README.md) 与领域语言蓝图。`npm run blueprint:where -- <源码路径>` 可从源码反查蓝图，`npm run blueprint:impact -- <蓝图 ID>` 可列出候选影响范围；两者只提供定位，不替代实现判断。

规划讨论、候选建议、创意草稿和一次性开发计划集中位于 [`docs/drafts/`](docs/drafts/README.md)。草稿不直接约束产品或源码；只有人工明确提出正式迁移后，才按影响定位拆入正式责任文件并删除已经迁移的草稿来源。一次性计划获得端到端自动执行授权后，技术决策由智能体在正式契约内完成，影响产品方向的选择仍由人工决定，具体边界见 [`docs/drafts/plans/README.md`](docs/drafts/plans/README.md)。

Git 长期分支的职责、同步方向、逐切片双分支闭环和人工门禁见 [`docs/guides/git-branch-workflow.md`](docs/guides/git-branch-workflow.md)。`main` 只接受经过人工审核的 `dev -> main`；`dev_blueprint` 负责规划，`dev_code` 负责源码实现，多个计划切片不得压缩为同一个代码提交。

## 当前实现阶段

当前候选已经实现根路径跳转、炎国版表站与 1084 里站独立页面树、`Production` / `Performance` 领域数据、双站独立视觉语法、分域搜索、四级污染及带存单和逐场纪念票的模拟购票体验。页面、路由、搜索、票务和验证器消费同一不可变内容快照；本季与历史由各时间层固定泰拉时钟派生。表站与等级 `0` 里站的核心内容不依赖客户端 JavaScript；污染状态在当前标签页保存事件数和稳定变体，前两次有效事件保持等级 `0`。默认展示只生成 `yan / zh-CN`；其余八个国家版本只进入九国家版本技术预览，均未经过人工翻译审核。当前九种国家版本内容均为运行时预览，不标记为 `formal`；显式正式构建会因批准摘要为空而停止。

参考网站与具体转译方式记录在 [`docs/references/design-reference.md`](docs/references/design-reference.md)。

## 版权说明

本项目为个人学习与同人创作概念，不代表《明日方舟》或其版权方。当前视觉由项目原创 HTML/CSS、SVG 与生成图像构成，运行时未使用游戏官方素材。
