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
│   ├── quality.mjs
│   ├── validate-build.mjs
│   ├── validate-locales.mjs
│   └── validate-states.mjs
└── src/
    ├── pages/
    │   ├── index.astro
    │   └── [routePrefix]/
    ├── layouts/
    │   ├── BaseLayout.astro
    │   ├── FrontLayout.astro
    │   └── ArchiveLayout.astro
    ├── components/
    │   ├── archive/
    │   ├── front/
    │   └── shared/
    ├── assets/
    ├── data/
    │   └── localized/
    ├── scripts/
    └── styles/
        ├── main.css
        ├── foundation.css
        ├── front.css
        ├── ticketing.css
        ├── archive.css
        └── pollution.css
```

`.astro/`、`dist/`、`node_modules/`、工具缓存、测试报告和部署平台本地状态都是生成内容，不进入版本控制。`dist/` 是唯一部署产物，不直接部署 `src/`。根目录 `.gitignore` 只排除可重建产物、本地环境与编辑器噪声，不排除源码、锁文件或共享配置。

## 当前实现与后续目标

当前源码以 `release` 与 `preview` 两种构建画像生成同一套页面：`src/pages/index.astro` 只负责进入 `/yan/`，表站与 1091 里站使用独立页面树；`src/data/performances.ts` 与 `src/data/productions.ts` 保存不含显示语言的场次和剧目事实，`src/data/localized/` 保存类型化国家版本内容包；搜索、污染和票务作为原生 TypeScript 渐进增强按页面装配。

已经成立并须继续保持的边界包括：

- `/` 只负责跳转 `/yan/`，已发布国家版本按 `routePrefix` 静态生成页面；
- 表站与 `/archive/site/1091/` 里站使用独立页面树、布局、导航、内容入口、视觉资源和客户端状态；
- `Performance`、`Production` 及其有序关联替代混合 `Show`，列表、详情、搜索与票务从同一数据源派生；
- 搜索页按国家版本、世界和快照年份隔离，并从同一类型化内容源生成各自的构建期索引；
- 表站稳定票务页启用模拟购票模组，并保留“暂未开票”无脚本降级；里站票务页保持历史不可购买状态；
- 正式发布集合只包含 `yan / zh-CN`，生成 32 个静态页面；三语言预览额外包含 `higashi / ja-JP` 与 `columbia / en-US` 等价页面，共生成 94 个页面。东国和哥伦比亚内容只用于技术与视觉预览，不代表翻译已通过人工审核。

当前实现处于 `candidate`，正式发布仍需人工内容与发布审核。未来语言或创意模组只有经过独立规划后才进入实现；不得恢复单页锚点、混合模型或双世界同页 DOM 作为第二套正式架构。

## 工程质量边界

- `blueprint:check` 检查蓝图 ID、依赖、文档路径和功能源码映射是否漂移；
- `astro check` 检查 Astro 模板和 TypeScript 类型；
- ESLint 使用类型信息检查 TypeScript，并通过 Astro 解析器检查组件；Stylelint 检查分层 CSS 的高置信缺陷；Prettier 统一 Astro、TypeScript、配置和文档格式；
- `.editorconfig` 与 `.gitattributes` 固定 UTF-8、LF、末尾换行和基础缩进；
- `scripts/quality.mjs` 根据显式路径或当前变更选择补丁空白、蓝图、类型、代码、样式和格式检查，并说明触发原因；
- `npm run quality` 是日常最小检查入口；`npm run build` 只生成静态产物；`npm run verify` 只编排一次完整质量检查、关键状态验证、一次构建和静态产物验证，用于工具链变更、跨层集成、合并、发布和正式候选阶段。

依赖版本由 `package-lock.json` 固定；锁文件未变化时使用 `npm ci` 获得可复现安装。`.npmrc` 强制 Node 引擎范围，并让未来新增依赖默认精确记录。

## 蓝图追踪层

`docs/blueprint/` 只描述正式目标、契约、边界和阶段标准，不直接参与网站构建。`traceability.json` 以稳定蓝图 ID 维护蓝图依赖及其与现有功能源码的关系；同一源码有一个主要蓝图，也可以关联实际约束它的辅助蓝图。新功能源码创建、删除或改名时同步维护真实映射，不预填尚未出现的路径。

`scripts/blueprint.mjs` 只检查漂移、从源码反查蓝图、从蓝图列出候选影响范围。它不理解蓝图语义、不自动修改源码，也不要求每个候选文件产生变更。完整规则见 `docs/blueprint/README.md`。

## 草稿规划层

`docs/drafts/` 保存没有正式产品效力的蓝图、建议与创意草稿，以及一次性开发计划。草稿通过人工门禁单向迁入正式责任目录，不加入追踪表，也不在迁移后保留正文副本。已获批准的一次性计划只编排工作，不能覆盖正式蓝图。完整生命周期见 `docs/drafts/README.md`。

普通功能开发只读取正式蓝图。规划讨论、草稿评审、已批准计划和正式迁移任务才读取草稿；正式内容规则进入 `docs/blueprint/content/`，实际运行内容进入 `src/data/` 或未来唯一的 `src/content/`，外部依据进入 `docs/references/`。

## 页面与布局层

`astro.config.ts` 使用静态输出。`src/pages/` 负责把正式路由生成具体页面；可以复用参数化构建逻辑，但公开 URL 必须符合 `BP-FND-CORE`，不得由翻译标题或显示名推导。

布局负责文档外壳、`lang`、标题、描述、canonical、robots、世界标识、页面类型、全局样式和按页客户端入口。表站与里站使用独立布局或明确分离的布局变体，不在一个 HTML 中同时装配两个完整网站。根路径跳转、合法深层直达和无 JavaScript 导航必须保持。

## Astro 组件层

`src/components/` 按页面与用户能力划分：

- `front/`：表站场次呈现、剧目视觉和票务体验；
- `archive/`：里站场次呈现与 1091 年代视觉；
- `shared/`：两个网站真正共享的基础结构、页脚声明和无障碍能力。

只有在出现真实复用或独立职责时才增加新的能力目录；覆盖呈现不得承担本应独立路由的完整页面。

Astro 组件只负责构建期结构和内容装配，不在组件之间建立隐式客户端状态。只有两个以上页面具有相同语义和状态时才抽取共享组件，避免为了形式统一让两站重新耦合。

## 内容数据层

`src/data/` 保存不依赖 DOM 的稳定事实与本地化内容。正式领域模型遵守 `BP-FND-DOMAIN`，国家版本内容遵守 `BP-I18N-CORE`：

- `Production` 保存可复用剧目的稳定 ID 与视觉事实；
- `Performance` 保存泰拉日期时间、地点 ID、状态、票务可用性、分区与基础价格，并按顺序引用一个或多个剧目；
- 表站和里站的本季、历史集合由显式世界视角与内容状态生成，不读取浏览器现实时间；
- 搜索索引、场次和剧目详情、票务输入均从相同稳定 ID 派生；
- 国家版本注册显式保存 `editionId`、`routePrefix` 与 locale，不从显示名推导；
- `localized/<editionId>/` 以相同类型契约保存网站文案、消息、地点、场次和剧目显示内容；页面与客户端只消费解析后的当前国家版本记录，语义状态不保存显示文字。

`performances.ts`、`productions.ts` 与 `locations.ts` 是当前演出领域事实源，本地化目录是显示内容源；两者通过稳定 ID 关联，不得恢复混合 `Show`、在页面中保存可编辑副本，或让翻译复制日期、票价和状态。只有当同构内容扩展到多文件、需要 Markdown 正文或编辑流程时，才整体迁移到 Astro Content Collections。

## 客户端交互层

搜索、筛选、污染和票务分别通过明确的页面入口初始化；页面没有对应模组根节点时安全跳过。表站与等级 `0` 里站的核心内容、导航和退出不以这些脚本成功执行为前提。

目标能力边界包括：

- 普通导航与可选过场：通过真实链接完成路由，过场只是渐进增强；
- 搜索：只加载当前国家版本、世界和快照范围的构建期索引；
- 污染：拥有当前标签页的四级状态、单一概率配置和稳定呈现选择，不修改底层内容；
- 票务：拥有当前标签页的票篮、尝试、结局和生成产物，未启用时由静态页降级；
- 页面局部交互：筛选、对话框和表单只读取本页 DOM，失败不阻断基础内容。

模块通过显式 `export` / `import` 协作。只有真实一对多通知才使用事件，不建立默认全局事件总线或远端插件系统。

## 样式层

`src/styles/main.css` 是唯一装配入口，按固定顺序导入以下职责文件：

1. `foundation.css`：共享尺度、重置、外壳、任务基础、无障碍和全局响应式；
2. `front.css`：表站令牌、当代编辑系统、电影舞台、页面族和表站响应式；
3. `ticketing.css`：票务流程、存单、纪念票、票务响应式和打印；
4. `archive.css`：里站令牌、等级 `0` 仪式档案剧场、页面族和里站响应式；
5. `pollution.css`：污染等级、变体、装饰层及其窄屏与减少动态效果约束。

真正共享的基础才进入 `foundation.css`，世界视觉不能以共享之名收敛为同一布局换色。只有规则完全属于单个可复用组件时才迁入组件作用域。污染样式不得随机删除或移动语义 DOM；打印样式不得裁切票面必要信息。

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
