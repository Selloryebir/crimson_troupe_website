# 仓库结构与依赖边界

## 目标

仓库结构应让人员和智能体快速判断信息位置、责任方和影响范围。Astro 负责构建期静态生成与组件化，浏览器端使用原生 TypeScript 渐进增强；表站、里站、内容和交互通过显式接口协作。

## 当前目录

```text
crimson_troupe_website/
├── AGENTS.md
├── README.md
├── astro.config.ts
├── package.json
├── package-lock.json
├── docs/
│   ├── architecture/
│   ├── blueprint/
│   ├── drafts/
│   ├── guides/
│   ├── project/
│   ├── research/
│   └── sources/
├── scripts/                  # 仓库质量、构建验证与性能工具
└── src/
    ├── assets/
    ├── components/
    │   ├── archive/
    │   ├── front/
    │   ├── shared/
    │   └── ticketing/
    ├── data/
    │   ├── content/          # 构建上下文、资格、变体与快照解析
    │   ├── localized/        # 类型化国家版本内容
    │   └── productions/      # 语言无关剧目来源
    ├── layouts/
    ├── pages/
    ├── scripts/
    └── styles/
```

目录树只展开长期职责；具体文件、参数化页面和国家版本以工作区为准，不在文档复制完整清单。`.astro/`、`dist/`、`node_modules/`、缓存和测试报告属于可重建产物，不进入版本控制；`dist/` 是唯一部署产物。

## 运行时拓扑

- `showcase`、`preview` 与 `release` 是有限命名构建预设，共用内容解析和页面装配；构建范围与资格由 `src/data/content/` 解析，页面数量由快照派生；
- 根路径只进入炎国表站，表站与 1084 里站生成独立页面树；公开路由由 `src/pages/` 与 `src/data/site-routes.ts` 协作，不从翻译标题生成；
- 页面、搜索、票务和验证器消费同一不可变构建快照，不各自遍历底层注册表；
- 表站与等级 `0` 里站的核心内容不依赖客户端脚本，搜索、筛选、污染和票务按页面能力增强。

具体行为由 active 蓝图拥有，当前命令与构建方式见 [`../guides/development.md`](../guides/development.md)。本文件只定义物理职责和允许的依赖方向。

## 源码层职责

| 层                | 责任                                                     | 不负责                                       |
| ----------------- | -------------------------------------------------------- | -------------------------------------------- |
| `src/pages/`      | 文件路由、静态路径和页面装配                             | 保存业务正文或客户端私有状态                 |
| `src/layouts/`    | HTML 外壳、元数据、世界级样式和按页客户端入口            | 合并两站完整 DOM 或实现功能状态机            |
| `src/components/` | 构建期页面结构；按 `front/archive/ticketing/shared` 分责 | 隐式全局状态或重复领域事实                   |
| `src/data/`       | 领域事实、国家版本内容、内容资格和不可变快照             | DOM、组件或浏览器运行时                      |
| `src/scripts/`    | 搜索、筛选、污染、票务等渐进增强                         | 重写底层内容或直接修改其他模组私有状态       |
| `src/styles/`     | 共享基础及表站、里站、票务、污染的按需视觉规则           | 以样式隐藏语义状态或把两站收敛为同一换色布局 |
| `src/assets/`     | 具有运行时消费者且权利清晰的压缩素材                     | 本地参考、过程稿和未批准比较样张             |
| `scripts/`        | 仓库维护、蓝图追踪、质量、构建产物、浏览器和性能验证     | 浏览器产物或产品运行逻辑                     |

只有两个以上页面确有相同语义和状态时才抽取共享组件；只有出现独立职责、明显同构增长、频繁冲突或可独立测试收益时才继续拆分文件。

## 内容所有权

- `src/data/editions.ts` 注册国家版本；语言无关地点、场次和剧目分别由 `locations.ts`、`performances.ts` 与 `productions/` 拥有；
- `src/data/localized/<editionId>/` 提供完整国家版本接口，页面只消费解析结果；稳定 ID、日期、状态、票价和拓扑不进入翻译；
- 同一权威字段只保存一次。需要联动审核的多国家版本内容可以按稳定实体并排维护，但仍通过完整国家版本包对外；
- 官方活页标题与描述是受控跨层镜像：人员来源在 [`../sources/official-folio-productions.md`](../sources/official-folio-productions.md)，构建镜像在 `src/data/productions/folio-source-records.ts`，由 `scripts/validate-content.mjs` 核对；
- 来源修订、素材摘要和批准摘要是防漂移凭据，不是正文副本；页面数量、测试结果和批准现状由命令或注册表报告，不写入长期结构文档。

内容目录不表达发布资格。根集合、完整变体、批准摘要和构建预设通过唯一解析边界形成快照；`docs/` 不参与构建。只有同构内容确实需要 Markdown 正文或编辑流程时，才整体迁移到唯一的 Content Collections，不与 TypeScript 内容源并存。

## 客户端与样式装配

页面入口只初始化本页存在的能力，缺少根节点时安全跳过。模块通过显式 `import` / `export` 协作；事件只用于真实一对多通知，不建立默认全局事件总线。

`src/styles/main.css` 只装配共享 `foundation.css`。表站、里站、票务与污染样式由对应布局或组件按需加载；污染和装饰不得改变语义 DOM、焦点、可读状态或可靠退出。

## 文档层职责

| 目录            | 唯一责任                                     |
| --------------- | -------------------------------------------- |
| `blueprint/`    | 已采纳的目标、行为契约、边界与阶段标准       |
| `architecture/` | 当前工程结构与依赖方向                       |
| `guides/`       | 可重复执行的开发、Git 和制作步骤             |
| `sources/`      | 官方原文、来源身份与素材权利记录             |
| `research/`     | 外部资料分析、设计转译与排除项               |
| `project/`      | 不参与构建的项目作者资料、候选目录和比较样张 |
| `drafts/`       | 尚未采纳的提案与完成后删除的一次性计划       |

完整信息归属见 [`../README.md`](../README.md)，蓝图与源码映射只维护在 [`../blueprint/traceability.json`](../blueprint/traceability.json)。

## 允许的依赖方向

```text
pages -> layouts + components -> typed data
layouts -> metadata + styles + page entry
page entry -> feature modules -> typed data + shared DOM helpers
content consumers -> immutable build snapshot -> typed registries
pollution module -> narrative state interface
ticketing module -> performance data
programs + search + ticketing -> site time interface
```

- `data/` 不依赖组件、客户端脚本或 DOM；
- 组件不读取客户端模组私有状态；搜索、污染与票务不相互改写状态；
- 表站与里站只通过 URL、共享领域身份和明确导航协作；
- 文档、研究资料、草稿与作者样张不成为运行时输入；
- 新框架、服务器能力、全局状态或通用插件平台必须先有真实需求和正式契约。
