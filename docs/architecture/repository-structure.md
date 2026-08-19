# 仓库结构与依赖边界

## 目标

仓库结构应让人员和智能体能快速回答三个问题：信息在哪里、谁负责它、修改会影响什么。Astro 用于构建期静态生成和组件化，浏览器端保持原生 TypeScript，不引入不必要的 UI 框架运行时。

## 目录树

```text
crimson_troupe_website/
├── AGENTS.md
├── README.md
├── astro.config.ts
├── eslint.config.mjs
├── package.json
├── package-lock.json
├── prettier.config.mjs
├── stylelint.config.mjs
├── tsconfig.json
├── docs/
│   ├── README.md
│   ├── architecture/
│   ├── blueprint/
│   │   ├── foundation/
│   │   ├── modules/
│   │   ├── content/
│   │   ├── i18n/
│   │   ├── quality/
│   │   └── traceability.json
│   ├── drafts/
│   │   ├── README.md
│   │   ├── blueprint/
│   │   ├── recommendations/
│   │   ├── creative/
│   │   └── plans/
│   ├── guides/
│   └── references/
├── scripts/
│   └── blueprint.mjs
└── src/
    ├── pages/
    │   └── index.astro
    ├── layouts/
    │   └── BaseLayout.astro
    ├── components/
    │   ├── archive/
    │   ├── front/
    │   ├── overlays/
    │   └── shared/
    ├── assets/
    ├── data/
    │   ├── archive-records.ts
    │   ├── search-index.ts
    │   └── shows.ts
    ├── scripts/
    │   ├── archive.ts
    │   ├── dialogs.ts
    │   ├── dom.ts
    │   ├── forms.ts
    │   ├── main.ts
    │   ├── navigation.ts
    │   ├── presentation.ts
    │   ├── programs.ts
    │   ├── search.ts
    │   └── world.ts
    └── styles/
        ├── archive.css
        ├── foundations.css
        ├── front.css
        ├── main.css
        ├── overlays.css
        └── responsive.css
```

`.astro/`、`dist/`、`node_modules/`、工具缓存、测试报告和部署平台本地状态都是生成内容，不进入版本控制。`dist/` 是唯一部署产物，不直接部署 `src/`。根目录 `.gitignore` 只排除可重建产物、本地环境与编辑器噪声，不排除源码、锁文件或共享配置。

## 工程质量边界

- `blueprint:check` 负责检查蓝图 ID、依赖、文档路径和功能源码映射是否漂移；
- `astro check` 负责 Astro 模板和 TypeScript 类型检查；
- ESLint 使用类型信息检查 `.ts`，并通过 Astro 解析器检查组件模板与 frontmatter；
- Stylelint 检查分层 CSS 的语法、无效属性、重复声明和重复选择器等高置信缺陷；
- Prettier 统一 Astro、TypeScript、配置和文档格式，现有分层 CSS 则保留手工组织方式；
- `.editorconfig` 与 `.gitattributes` 固定 UTF-8、LF、末尾换行和基础缩进，降低跨系统无意义 diff；
- `npm run quality` 是日常质量门禁，`npm run build` 会先执行同一门禁再生成静态产物。

依赖版本由 `package-lock.json` 固定；锁文件未变化时应使用 `npm ci` 获得可复现安装。`.npmrc` 强制 Node 引擎范围并让未来新增依赖默认精确记录。

## 蓝图追踪层

`docs/blueprint/` 只描述正式目标、契约、边界和阶段标准，不直接参与网站构建。`traceability.json` 以稳定蓝图 ID 维护蓝图之间以及蓝图与功能源码之间的关系；同一源码有一个主要蓝图，也可以关联多个辅助蓝图。

`scripts/blueprint.mjs` 只提供三项轻量能力：检查路径与 ID 是否漂移、从源码反查蓝图、从蓝图列出候选影响范围。它不理解蓝图语义，不自动修改源码，也不要求候选文件必须产生变更。完整使用规则见 `docs/blueprint/README.md`。

## 草稿规划层

`docs/drafts/` 集中保存蓝图、建议与创意草稿，以及一次性开发计划。内容草稿统一使用“正文、待解决问题、正式拆分与影响定位”三个顶层部分，并通过人工门禁单向迁入正式责任目录。草稿不直接约束产品或源码、不加入 `traceability.json`，也不在完成迁移后保留正文副本；已获人工授权的一次性计划只约束执行顺序，不得覆盖正式蓝图。完整生命周期见 `docs/drafts/README.md`。

普通功能开发只读取正式蓝图。规划讨论、草稿评审、已获授权的一次性计划和正式迁移任务才读取草稿；接受的稳定契约进入 `docs/blueprint/`，正式内容规则进入 `docs/blueprint/content/`，实际运行内容进入 `src/data/` 或未来唯一的 `src/content/`，外部依据进入 `docs/references/`。

## 构建与页面层

`astro.config.ts` 明确使用静态输出。`src/pages/` 按文件路径生成页面；当前 `index.astro` 是唯一公开路由，只负责装配布局和领域组件。

`src/layouts/BaseLayout.astro` 负责文档外壳、元数据、全局样式和客户端入口。页面组件不重复声明 `<html>`、`<head>` 或全局脚本。

## Astro 组件层

`src/components/` 按叙事和界面责任划分：

- `front/`：新剧团官网及节目组件；
- `archive/`：旧剧团档案结构；
- `overlays/`：搜索、剧目详情、预约和影像浮层；
- `shared/`：真正被两个时间层共享的结构。

Astro 组件只负责构建期结构和内容装配，不在组件之间建立隐式客户端状态。表站与里站保持独立组件树，但继续生成在同一个 HTML 文档中，以保留“当前网站被旧档案侵入”的叙事连续性。

## 内容数据层

`src/data/` 保存不依赖 DOM 的 TypeScript 内容：

- `shows.ts` 是剧目卡、详情、筛选元数据、搜索和预约选项的唯一事实源；
- `search-index.ts` 从剧目数据生成演出搜索条目，再组合页面与档案入口；
- `archive-records.ts` 保存里站恢复记录正文，并提供记录 ID 类型守卫。

新增稳定实体时先定义清晰类型。只有当同构内容扩展到多文件、需要 Markdown 正文或编辑流程时，再迁移到 Astro Content Collections；不同时维护 TypeScript 数据与内容集合两个事实源。

## 客户端交互层

`src/scripts/main.ts` 是唯一浏览器装配入口，只负责按顺序初始化模块。其他文件按用户能力划分：

- `world.ts`：表里世界状态、URL、标题和可访问隐藏状态；
- `presentation.ts`：滚动揭示、视差和时钟；
- `navigation.ts`：移动导航；
- `programs.ts`：节目筛选；
- `dialogs.ts`：弹窗与剧目详情；
- `search.ts`：搜索、键盘浏览和结果路由；
- `forms.ts`：概念表单反馈；
- `archive.ts`：里站档案与邀请交互；
- `dom.ts`：必需 DOM 查询及失败提示。

模块通过显式 `export`/`import` 协作，不访问其他模块的私有状态。Astro 会在构建时处理、打包并输出这些 TypeScript 模块。

## 样式层

`src/styles/main.css` 按顺序装配现有视觉层：

1. `foundations.css`：变量、重置、通用辅助类和世界容器；
2. `front.css`：表站页面及业务区块；
3. `archive.css`：里站页面；
4. `overlays.css`：搜索、剧目、预约、影像和通知浮层；
5. `responsive.css`：断点与减少动态效果。

当前视觉系统跨多个页面区块共享，因此保留集中分层 CSS。只有规则完全属于单个可复用组件时，才迁入组件作用域，避免把整体视觉语言碎片化。

## 允许的依赖方向

```text
pages -> layouts + components -> data
layouts -> styles + scripts/main
scripts/main -> feature scripts -> data + scripts/dom
```

- `data/` 不依赖组件、脚本或 DOM；
- 组件可以消费数据，但不依赖客户端模块的内部状态；
- 功能模块不反向初始化 `main.ts`；
- 文档不成为运行时输入；
- 表站和里站只通过 `world.ts` 定义的世界状态切换。

## 何时继续拆分

仅在出现可观察收益时拆分：同一组件包含多个独立职责、同构内容大量增加、多人修改频繁冲突，或模块可以被独立测试。不要为每个小函数创建文件，也不要为了“使用 Astro”引入 React、Vue 或服务器渲染。
