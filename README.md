# 猩红剧团概念网站

一个基于《明日方舟》世界观的非官方同人网站原型。设计问题是：

> 如果一位泰拉人搜索“猩红剧团”，会打开怎样的网站？

项目包含两个相互关联但独立浏览的时间层：

- **表站 / `front`：** 《红丝绒》事件后重新组建的新猩红剧团官网，时间定义为叙事语义上的“现在”，克制、现代、庄重且专业；
- **里站 / `archive`：** 泰拉历 1091 年旧剧团官网的历史快照，年代化、阴暗、怪异，并可以在浏览过程中逐级污染。

表站与里站的正式目标是共享工程基础但使用独立 URL、页面装配、内容节奏和客户端状态，不是同一页面的明暗换肤。当前源码仍是可部署的单页 Demo，正式蓝图已经记录后续多页面重构边界；不要把当前实现误作目标架构。

## 运行

项目使用 Astro 7、TypeScript 6 和 Node.js 24 LTS。首次运行先安装依赖：

```bash
npm install
npm run dev
```

然后访问终端给出的本地地址。日常开发使用 `npm run quality -- <本次改动路径...>`，只执行与实际变更有关的检查；不提供路径时自动读取工作区变更。`npm run build` 只生成 `dist/`，不重复运行质量门禁。工具链变更、跨层集成、合并、发布和正式候选阶段使用 `npm run verify`，由它执行一次完整检查和一次构建。运行时输出变化后再使用 `npm run preview` 验收构建结果。

## 正式产品边界

- 根路径 `/` 固定跳转至简体中文表站首页 `/yan/`；首发只生成炎国 `yan / zh-CN` 网站；
- 表站和里站均提供首页、本季演出、历史演出、剧团、搜索及次级票务页；里站路由位于 `/{routePrefix}/archive/site/1091/`；
- 国家版本使用独立 `editionId`、公开 `routePrefix` 和技术 locale。完整且已人工确认的矩阵只维护在 [`BP-I18N-CORE`](docs/blueprint/i18n/localization-contract.md)；
- `Performance` 表示一次具有日期、地点和有序剧目编排的完整场次，`Production` 表示可被多个场次复用的单独剧目。规范术语只维护在 [`BP-FND-DOMAIN`](docs/blueprint/foundation/domain-language.md)；
- 表站票务正式目标是可独立启停的模拟小游戏；未实现或停用时，稳定票务地址显示“暂未开票”。1091 里站当前全部场次不可购买；
- 只有 `/yan/` 允许索引；其他页面保持可直接访问，但输出 `noindex,follow`。

完整目标、阶段差距和验收条件以 [`docs/blueprint/`](docs/blueprint/README.md) 为准。

## 仓库结构

```text
├── docs/           # 架构、正式蓝图、临时草稿、指南和外部参考
├── scripts/        # 仓库维护和蓝图追踪工具，不进入浏览器产物
├── src/
│   ├── components/ # 表站、里站、浮层和共享 Astro 组件
│   ├── layouts/    # 页面外壳与公共元数据
│   ├── pages/      # Astro 文件路由入口
│   ├── assets/     # 拥有使用权的运行时静态资产
│   ├── data/       # 类型化内容；目标领域模型为 Performance / Production
│   ├── scripts/    # 原生 TypeScript 页面能力与交互模组
│   └── styles/     # 基础、时间层、浮层和响应式样式
├── astro.config.ts # Astro 静态输出配置
├── package.json    # 唯一推荐的开发、质量检查和构建命令
├── AGENTS.md       # Agent 工作与验证规范
└── README.md
```

详细职责与当前到目标架构的过渡边界见 [`docs/architecture/repository-structure.md`](docs/architecture/repository-structure.md)，文档入口见 [`docs/README.md`](docs/README.md)。

功能开发前应先阅读 [`docs/blueprint/README.md`](docs/blueprint/README.md) 与领域语言蓝图。`npm run blueprint:where -- <源码路径>` 可从源码反查蓝图，`npm run blueprint:impact -- <蓝图 ID>` 可列出候选影响范围；两者只提供定位，不替代实现判断。

规划讨论、候选建议、创意草稿和一次性开发计划集中位于 [`docs/drafts/`](docs/drafts/README.md)。草稿不直接约束产品或源码；只有人工明确提出正式迁移后，才按影响定位拆入正式责任文件并删除已经迁移的草稿来源。

Git 长期分支的职责、同步方向和人工门禁见 [`docs/guides/git-branch-workflow.md`](docs/guides/git-branch-workflow.md)。`main` 只接受经过人工审核的 `dev -> main`，`dev_blueprint` 负责规划，`dev_code` 负责源码实现。

## 当前 Demo

当前单页原型用于证明 Astro 静态构建、原生 TypeScript 交互、响应式视觉和双时间层概念可以运行，包含表站内容、筛选、详情、搜索、概念表单、旧档案面板及表里切换。它尚未实现正式蓝图中的国家版本路由、独立双站、领域模型、四级污染和票务小游戏。

参考网站与具体转译方式记录在 [`docs/references/design-reference.md`](docs/references/design-reference.md)。

## 版权说明

本项目为个人学习与同人创作概念，不代表《明日方舟》或其版权方。当前视觉均由 HTML/CSS 构成，未使用游戏官方素材。
