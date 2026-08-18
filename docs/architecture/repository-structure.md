# 仓库结构与依赖边界

## 目标

仓库结构应让人员和智能体能快速回答三个问题：信息在哪里、谁负责它、修改会影响什么。当前项目保持零构建依赖，不为了拆分而引入框架。

## 目录树

```text
crimson_troupe_website/
├── AGENTS.md
├── README.md
├── docs/
│   ├── README.md
│   ├── architecture/
│   ├── blueprint/
│   ├── creative/
│   ├── guides/
│   └── references/
└── src/
    ├── index.html
    ├── assets/
    ├── data/
    │   ├── search-index.js
    │   └── shows.js
    ├── scripts/
    │   ├── archive.js
    │   ├── dialogs.js
    │   ├── forms.js
    │   ├── main.js
    │   ├── navigation.js
    │   ├── presentation.js
    │   ├── programs.js
    │   ├── search.js
    │   └── world.js
    └── styles/
        ├── archive.css
        ├── foundations.css
        ├── front.css
        ├── main.css
        ├── overlays.css
        └── responsive.css
```

## 源码职责

### HTML 装配层

`src/index.html` 是当前唯一页面入口，负责语义结构、基础内容和可访问名称。它只加载 `styles/main.css` 与 `scripts/main.js`，不感知各子模块的内部依赖。

在没有构建工具之前，不把 HTML 拆成需要运行时抓取的碎片，以免核心内容依赖 JavaScript 才能显示。

### 内容数据层

`src/data/` 保存可复用的结构化内容，不直接读取或修改 DOM：

- `shows.js` 是剧目详情、搜索元数据和主创信息的唯一事实源；
- `search-index.js` 从剧目数据生成演出条目，再组合非剧目页面条目。

新增数据文件应按稳定实体或业务领域划分，不按某个组件的临时形状命名。

### 交互模块层

`src/scripts/main.js` 是唯一装配入口，只负责按顺序初始化模块。其他文件按用户能力划分：

- `world.js`：表里世界状态、URL、标题和可访问隐藏状态；
- `presentation.js`：滚动揭示、视差和时钟等非业务表现；
- `navigation.js`：移动导航开合；
- `programs.js`：节目筛选；
- `dialogs.js`：通用弹窗绑定及剧目详情；
- `search.js`：搜索、键盘浏览及搜索结果路由；
- `forms.js`：概念表单反馈；
- `archive.js`：里站档案与邀请交互。

模块不得通过隐式全局变量通信。需要跨模块调用时使用显式 `export`/`import`，数据优先放在 `data/`，不要复制常量。

### 样式层

`src/styles/main.css` 只声明按顺序加载的样式层：

1. `foundations.css`：变量、重置、通用辅助类和世界容器；
2. `front.css`：表站页面及其业务区块；
3. `archive.css`：里站专属页面；
4. `overlays.css`：搜索、剧目、预约、影像及通知浮层；
5. `responsive.css`：集中管理断点和减少动态效果。

表站和里站样式不应互相覆盖内部组件。真正共享的规则上移到 `foundations.css`；只服务浮层的规则不回流到页面样式。

### 资产层

`src/assets/` 只存放拥有使用权且由运行页面直接消费的静态资产。来源说明和许可记录放入 `docs/references/`，不与二进制文件混放。

## 允许的依赖方向

```text
index.html
  ├─> styles/main.css ─> foundations/front/archive/overlays/responsive
  └─> scripts/main.js ─> feature modules ─> data modules
```

- `data/` 不依赖 `scripts/` 或 DOM；
- 功能模块不反向初始化 `main.js`；
- 文档不成为运行时输入；
- `assets/` 不包含业务逻辑；
- 表站和里站只通过 `world.js` 定义的世界状态发生切换。

## 何时继续拆分

仅在出现可观察收益时拆分：文件包含多个独立职责、同一数据被多处复制、多人修改频繁冲突，或某个模块可以被独立测试。不要为每个小函数创建文件，也不要在没有路由和构建需求时迁移到框架。
