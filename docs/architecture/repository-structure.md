# 仓库结构与依赖边界

## 目标

仓库结构应让人员和智能体快速回答三个问题：信息在哪里、谁负责它、修改会影响什么。Astro 负责构建期静态生成和组件化，浏览器端保持原生 TypeScript；表站与里站最终生成独立页面树，污染与票务以可独立启停的客户端模组增强页面。

## 当前目录树

```text
crimson_troupe_website/
├── AGENTS.md
├── README.md
├── astro.config.ts
├── package.json
├── package-lock.json
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
│   ├── blueprint.mjs
│   └── quality.mjs
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
    ├── scripts/
    └── styles/
```

`.astro/`、`dist/`、`node_modules/`、工具缓存、测试报告和部署平台本地状态都是生成内容，不进入版本控制。`dist/` 是唯一部署产物，不直接部署 `src/`。根目录 `.gitignore` 只排除可重建产物、本地环境与编辑器噪声，不排除源码、锁文件或共享配置。

## 当前实现与正式目标

当前源码是单页 Demo：`src/pages/index.astro` 在同一 HTML 中装配表站、里站与浮层，`src/scripts/main.ts` 初始化依赖同页 DOM 的功能，`src/data/shows.ts` 使用混合 `Show` 数据。这些内容证明构建和体验概念可运行，但不是正式架构约束。

正式目标按 active 蓝图逐步替换为：

- `/` 只负责跳转 `/yan/`，已发布国家版本按 `routePrefix` 静态生成页面；
- 表站与 `/archive/site/1091/` 里站使用独立页面树、布局、导航、内容入口、视觉资源和客户端状态；
- `Performance`、`Production` 及其有序关联替代混合 `Show`，列表、详情、搜索与票务从同一数据源派生；
- 搜索按国家版本、世界和快照年份生成独立构建期索引；
- 污染与票务是可独立启停的增强模组，停用或失败时分别退化为等级 `0` 里站和“暂未开票”页。

过渡期间必须明确区分“当前源码事实”和“正式目标”。修改旧源码仍通过追踪表定位 active 蓝图；不得为了保留兼容性而把单页锚点、混合模型或双世界 DOM 固化为第二套正式架构。

## 工程质量边界

- `blueprint:check` 检查蓝图 ID、依赖、文档路径和功能源码映射是否漂移；
- `astro check` 检查 Astro 模板和 TypeScript 类型；
- ESLint 使用类型信息检查 TypeScript，并通过 Astro 解析器检查组件；Stylelint 检查分层 CSS 的高置信缺陷；Prettier 统一 Astro、TypeScript、配置和文档格式；
- `.editorconfig` 与 `.gitattributes` 固定 UTF-8、LF、末尾换行和基础缩进；
- `scripts/quality.mjs` 根据显式路径或当前变更选择补丁空白、蓝图、类型、代码、样式和格式检查，并说明触发原因；
- `npm run quality` 是日常最小检查入口；`npm run build` 只生成静态产物；`npm run verify` 只编排一次完整质量检查和一次构建，用于工具链变更、跨层集成、合并、发布和正式候选阶段。

依赖版本由 `package-lock.json` 固定；锁文件未变化时使用 `npm ci` 获得可复现安装。`.npmrc` 强制 Node 引擎范围，并让未来新增依赖默认精确记录。

## 蓝图追踪层

`docs/blueprint/` 只描述正式目标、契约、边界和阶段标准，不直接参与网站构建。`traceability.json` 以稳定蓝图 ID 维护蓝图依赖及其与现有功能源码的关系；同一源码有一个主要蓝图，也可以关联实际约束它的辅助蓝图。尚未出现的票务源码不预填映射；新源码创建时再登记。

`scripts/blueprint.mjs` 只检查漂移、从源码反查蓝图、从蓝图列出候选影响范围。它不理解蓝图语义、不自动修改源码，也不要求每个候选文件产生变更。完整规则见 `docs/blueprint/README.md`。

## 草稿规划层

`docs/drafts/` 保存没有正式产品效力的蓝图、建议与创意草稿，以及一次性开发计划。草稿通过人工门禁单向迁入正式责任目录，不加入追踪表，也不在迁移后保留正文副本。已获批准的一次性计划只编排工作，不能覆盖正式蓝图。完整生命周期见 `docs/drafts/README.md`。

普通功能开发只读取正式蓝图。规划讨论、草稿评审、已批准计划和正式迁移任务才读取草稿；正式内容规则进入 `docs/blueprint/content/`，实际运行内容进入 `src/data/` 或未来唯一的 `src/content/`，外部依据进入 `docs/references/`。

## 页面与布局层

`astro.config.ts` 使用静态输出。`src/pages/` 负责把正式路由生成具体页面；可以复用参数化构建逻辑，但公开 URL 必须符合 `BP-FND-CORE`，不得由翻译标题或显示名推导。

布局负责文档外壳、`lang`、标题、描述、canonical、robots、世界标识、页面类型、全局样式和按页客户端入口。表站与里站使用独立布局或明确分离的布局变体，不在一个 HTML 中同时装配两个完整网站。根路径跳转、合法深层直达和无 JavaScript 导航必须保持。

## Astro 组件层

`src/components/` 按页面与用户能力划分：

- `front/`：表站首页、演出、剧团与服务组件；
- `archive/`：1091 里站等级 `0` 结构及受控污染槽位；
- `overlays/`：确实需要覆盖呈现的局部交互，不承担本应独立路由的完整页面；
- `shared/`：两个网站真正共享的基础结构、页脚声明和无障碍能力。

Astro 组件只负责构建期结构和内容装配，不在组件之间建立隐式客户端状态。只有两个以上页面具有相同语义和状态时才抽取共享组件，避免为了形式统一让两站重新耦合。

## 内容数据层

`src/data/` 保存不依赖 DOM 的 TypeScript 内容。正式领域模型遵守 `BP-FND-DOMAIN`：

- `Production` 保存可复用剧目内容；
- `Performance` 保存泰拉日期时间、地点、状态、票务可用性、分区与基础价格，并按顺序引用一个或多个剧目；
- 表站和里站的本季、历史集合由显式世界视角与内容状态生成，不读取浏览器现实时间；
- 搜索索引、场次和剧目详情、票务输入均从相同稳定 ID 派生；
- 国家版本注册显式保存 `editionId`、`routePrefix` 与 locale，不从显示名推导。

迁移完成前，`shows.ts` 仍是当前 Demo 的唯一事实源，不应在并行新文件中复制其数据。只有当同构内容扩展到多文件、需要 Markdown 正文或编辑流程时，才整体迁移到 Astro Content Collections。

## 客户端交互层

每个页面有明确客户端装配入口，或由单一入口按页面能力安全初始化。页面没有某个模组根节点时直接跳过；功能模块不反向初始化入口，也不访问其他模组私有状态。

目标能力边界包括：

- 普通导航与可选过场：通过真实链接完成路由，过场只是渐进增强；
- 搜索：只加载当前国家版本、世界和快照范围的构建期索引；
- 污染：拥有当前标签页的四级状态、单一概率配置和稳定呈现选择，不修改底层内容；
- 票务：拥有当前标签页的票篮、尝试、结局和生成产物，未启用时由静态页降级；
- 页面局部交互：筛选、对话框和表单只读取本页 DOM，失败不阻断基础内容。

模块通过显式 `export` / `import` 协作。只有真实一对多通知才使用事件，不建立默认全局事件总线或远端插件系统。

## 样式层

`src/styles/main.css` 当前装配基础、表站、里站、浮层和响应式样式。正式多页面结构可以按页面只加载必要样式，但继续保持以下责任：

1. 共享基础令牌、重置和无障碍辅助类；
2. 表站独立的现代、明亮和权威视觉；
3. 里站等级 `0` 的年代视觉；
4. 污染模组的受控等级变体；
5. 票务流程、屏幕票面与打印表现；
6. 响应式和减少动态效果覆盖。

只有规则完全属于单个可复用组件时才迁入组件作用域。污染样式不得随机删除或移动语义 DOM；打印样式不得裁切票面必要信息。

## 允许的依赖方向

```text
pages -> layouts + components -> typed data
layouts -> metadata + styles + page entry
page entry -> feature modules -> typed data + shared DOM helpers
pollution module -> narrative state interface
ticketing module -> performance data
```

- `data/` 不依赖组件、脚本或 DOM；
- 组件可以消费数据，但不依赖客户端模块私有状态；
- 搜索、污染与票务不相互修改私有数据；
- 文档不成为运行时输入；
- 表站与里站通过 URL 和明确的跨世界导航协作，不共享隐式页面状态。

## 何时继续拆分

仅在出现可观察收益时拆分：一个组件包含多个独立职责、同构内容明显增加、多人修改频繁冲突，或能力可以被独立测试。不要为每个小函数创建文件，不为尚未出现的国家版本复制页面，也不要为了“使用 Astro”引入 React、Vue、服务器渲染或通用插件平台。
