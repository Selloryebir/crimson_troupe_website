# 猩红剧团概念网站

一个基于《明日方舟》世界观的非官方同人网站原型。设计问题是：

> 如果一位泰拉人搜索“猩红剧团”，会打开怎样的网站？

项目采用双时间层叙事：

- **表站 / 1098 年：** 新猩红剧团面向公众运营的正式官网，克制、庄重、专业。
- **里站 / 1091 年：** 被藏在网站底层的旧剧团档案，诡异、诱惑，并逐渐越过“档案”的边界。

## 运行

项目使用 Astro 7、TypeScript 6 和 Node.js 24 LTS。首次运行先安装依赖：

```bash
npm install
npm run dev
```

然后访问终端给出的本地地址。日常开发使用 `npm run quality -- <本次改动路径...>`，只执行与实际变更有关的检查；不提供路径时自动读取当前工作区变更。`npm run build` 只生成 `dist/`，不重复运行质量门禁。工具链变更、跨层集成、合并、发布和正式候选阶段使用 `npm run verify`，由它执行一次完整检查和一次构建。运行时输出发生变化后再用 `npm run preview` 验收构建结果。

## 仓库结构

```text
├── docs/           # 架构、正式蓝图、临时草稿、指南和外部参考
├── scripts/        # 仓库维护和蓝图追踪工具，不进入浏览器产物
├── src/
│   ├── components/ # 表站、里站、浮层和共享 Astro 组件
│   ├── layouts/    # 页面外壳与公共元数据
│   ├── pages/      # Astro 文件路由入口
│   ├── assets/     # 拥有使用权的运行时静态资产
│   ├── data/       # 类型化剧目、搜索和档案内容
│   ├── scripts/    # 原生 TypeScript 交互模块
│   └── styles/     # 基础、时间层、浮层和响应式样式
├── astro.config.ts # Astro 静态输出配置
├── eslint.config.mjs
├── prettier.config.mjs
├── stylelint.config.mjs
├── package.json    # 唯一推荐的开发、质量检查和构建命令
├── tsconfig.json   # 严格 TypeScript 配置
├── AGENTS.md       # Agent 工作与验证规范
└── README.md
```

详细职责和依赖方向见 [`docs/architecture/repository-structure.md`](docs/architecture/repository-structure.md)，文档入口见 [`docs/README.md`](docs/README.md)。

功能开发前应通过 [`docs/blueprint/README.md`](docs/blueprint/README.md) 定位对应蓝图。`npm run blueprint:where -- <源码路径>` 可从源码反查蓝图，`npm run blueprint:impact -- <蓝图 ID>` 可列出蓝图变化的候选影响范围；两者都只提供定位，不替代实现判断。

规划讨论、候选建议、创意草稿和一次性开发计划集中位于 [`docs/drafts/`](docs/drafts/README.md)。草稿不直接约束产品或源码；只有人工明确提出正式迁移后，才按影响定位拆入正式责任文件并删除已经迁移的草稿来源。

## 找到里站

表站页脚的馆藏编号是叙事入口。也可以使用 `Shift + D` 在两个时间层之间切换，或直接访问 `#archive-091`。

## 当前原型包含

- 响应式表站首页、可筛选演出季、剧团宣言、手记与通讯订阅区
- 三种泰拉化观看方式，以及包含主创、语言、观演提示和无障碍信息的剧目详情
- 支持快捷键 `/` 的站内搜索，并把搜索结果纳入双时间层叙事
- 隐藏的旧剧团档案页，以及有过场的双世界切换
- 预约席位和序幕弹窗、档案记录展开、邀请反馈
- 键盘可达、减少动态效果支持、语义化结构

参考网站与具体转译方式记录在 [`docs/references/design-reference.md`](docs/references/design-reference.md)。

## 版权说明

本项目为个人学习与同人创作概念，不代表《明日方舟》或其版权方。当前视觉均由 HTML/CSS 构成，未使用游戏官方素材。
