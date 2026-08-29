# 开发指南

执行 Git 写操作，或开始新的蓝图、源码、创意原型和专业资产阶段前，先阅读 [`git-branch-workflow.md`](git-branch-workflow.md)，确认当前工作分支类别、审核门禁和允许的晋级方向。日常工作从最新已确认的 `dev_code` 创建目标有限的工作分支，不直接在长期集成分支展开。

## 本地运行

项目要求 Node.js 24 LTS 和 npm。在仓库根目录首次执行：

```bash
npm install
npm run dev
```

访问终端输出的本地地址。不要直接打开生成前的 `.astro` 文件。

日常 `dev` 默认使用九国家版本 `preview`，确保国家版本选择器和跨版本状态可以直接验收；默认 `build` 仍使用单版本 `showcase`，不扩大可部署展示范围。有限构建预设及入口如下：

| 预设       | 开发命令                              | 构建命令                                   | 当前用途                                         |
| ---------- | ------------------------------------- | ------------------------------------------ | ------------------------------------------------ |
| `showcase` | `npm run dev:showcase`                | `npm run build` / `npm run build:showcase` | 炎国可部署展示                                   |
| `preview`  | `npm run dev` / `npm run dev:preview` | `npm run build:preview`                    | 九国家版本完整开发预览                           |
| `release`  | `npm run dev:release`                 | `npm run build:release`                    | 只接受已批准内容；当前会列出未批准稳定 ID 并停止 |

不得另设自由组合环境变量改变国家版本、根集合或内容资格。`release` 的当前失败是内容资格门禁，不是开发环境故障。

`npm run preview` 只服务当前 `dist/`，不选择或重建预设。需要验收九版本静态产物时，先运行 `npm run build:preview`；若其后又运行 `npm run build` 或 `npm run verify`，`dist/` 会恢复为单版本 `showcase`，此时应重新执行一次 `build:preview`。

锁文件未变化时，自动化环境和全新工作区应优先使用 `npm ci`，避免安装结果漂移。

## 质量命令

日常开发只检查本次实际修改的路径：

```bash
npm run quality -- docs/blueprint/modules/search.md
npm run quality -- src/data/performances.ts src/pages/[routePrefix]/performances/index.astro
```

不提供路径时，`quality` 自动读取当前工作区相对 `HEAD` 的已暂存、未暂存和未跟踪文件。它先输出文件数量、检查原因和具体命令，再执行最小相关检查。只需确认调度结果时使用：

```bash
npm run quality -- --plan docs/blueprint/modules/search.md
```

各命令的职责如下：

| 命令                                       | 职责                                                     |
| ------------------------------------------ | -------------------------------------------------------- |
| `npm run quality -- <路径>`                | 按实际改动调度最小必要检查                               |
| `npm run quality:docs`                     | 显式检查全部受管文档格式                                 |
| `npm run quality:blueprint`                | 显式检查正式蓝图格式及追踪关系                           |
| `npm run quality:code`                     | 显式检查全部 Astro/TypeScript、ESLint 与源码格式         |
| `npm run quality:styles`                   | 显式检查全部 CSS                                         |
| `npm run quality:full`                     | 执行一次蓝图、类型、代码、样式与全仓格式检查，不执行构建 |
| `npm run measure:performance`              | 对正在运行的本地站点执行限速、限频性能取样               |
| `npm run build`                            | 只生成 `dist/`，不调用质量命令                           |
| `npm run build:showcase`                   | 显式生成炎国未批准展示产物                               |
| `npm run build:preview`                    | 生成当前九国家版本预览产物                               |
| `npm run build:release`                    | 生成批准内容正式产物；当前应因无批准内容而停止           |
| `npm run validate:content`                 | 检查九国家版本内容闭包、源修订、素材摘要与批准漂移       |
| `npm run validate:content:showcase`        | 只对炎国展示集合执行同一聚焦内容门禁                     |
| `npm run validate:content:preview`         | 显式对九国家版本预览执行同一聚焦内容门禁                 |
| `npm run validate:content:release`         | 对正式集合执行内容门禁；当前应列出全部无批准摘要对象     |
| `npm run validate:states`                  | 确定性检查污染、票务状态与纪念票字段                     |
| `npm run validate:locales`                 | 检查默认炎国 `showcase` 的本地化覆盖                     |
| `npm run validate:locales:preview`         | 检查九国家版本预览构建的本地化覆盖                       |
| `npm run validate:build`                   | 检查已生成页面的路由、元数据、链接、资源与发布范围       |
| `npm run validate:build:preview`           | 检查九国家版本预览产物的路由、元数据、链接与隔离范围     |
| `npm run validate:browser:preview`         | 对已生成 preview 运行 Chromium 代表性冒烟矩阵            |
| `npm run validate:browser:preview:chrome`  | 以同一断言运行 Google Chrome 冒烟矩阵                    |
| `npm run validate:browser:preview:firefox` | 以同一断言运行 Firefox 冒烟矩阵                          |
| `npm run validate:browser:preview:webkit`  | 以同一断言运行 WebKit 冒烟矩阵                           |
| `npm run validate:browser:preview:edge`    | 以同一断言运行 Microsoft Edge 冒烟矩阵                   |
| `npm run verify`                           | 依次执行完整质量、状态、一次构建与静态产物门禁           |
| `npm run lint:code:fix`                    | 自动修复 ESLint 明确支持的代码问题                       |
| `npm run lint:styles:fix`                  | 自动修复 Stylelint 明确支持的样式问题                    |
| `npm run format`                           | 格式化 Astro、TypeScript、配置和文档，不改手工组织的 CSS |
| `npm run blueprint:check`                  | 检查蓝图 ID、依赖、路径和源码覆盖关系                    |

`quality` 的最小调度规则如下：

| 变更范围                       | 自动检查                                             |
| ------------------------------ | ---------------------------------------------------- |
| 草稿或普通说明文档             | 补丁空白、变更文件 Prettier                          |
| `docs/blueprint/`              | 文档检查、`blueprint:check`                          |
| 现有 `.ts`、`.astro`           | 项目级 Astro/TypeScript、变更文件 ESLint 与 Prettier |
| 现有 `.css`                    | 变更文件 Stylelint                                   |
| 功能源码新增、删除或重命名     | 对应源码检查、`blueprint:check`                      |
| 内容验证脚本                   | 对应 content、locale 或 state 能力检查               |
| 工具链或静态/浏览器门禁本身    | `verify`                                             |
| 多个运行时层，或蓝图与实现同步 | `verify`                                             |

Astro/TypeScript 类型关系可能跨文件，因此代码变更仍使用项目级 `astro check`；ESLint、Stylelint 和 Prettier 可以安全地限制为变更文件。`quality` 不负责运行普通构建或浏览器验收；运行时源码完成一个可交付切片后，先通过相关质量检查，再单独运行一次 `npm run build`。

浏览器冒烟命令不自行构建，也不生成截图或报告；应在一次 preview 构建及产物检查后运行。首次使用 Playwright 的环境可执行 `npx playwright install --with-deps chromium chrome firefox webkit msedge` 安装所需驱动与系统依赖。Chrome 与 Edge 默认使用系统品牌通道，也可分别用 `BROWSER_CHROME_EXECUTABLE_PATH` 与 `BROWSER_EDGE_EXECUTABLE_PATH` 指向已确认的稳定版可执行文件。五个命令复用同一组五项选择器、日/希/俄长文本、320px 票务与里站、搜索隔离、跨国家版本状态、下载与打印、三级污染与退出、减少动态效果、无脚本和搜索初始化失败等代表任务，不替代人工视觉验收。Playwright WebKit 可尽早发现 WebKit 问题，但不等于真实 macOS Safari；平台相关正式结论仍需在 Safari 当前稳定版复核。

`measure:performance` 默认对 `http://127.0.0.1:4321` 的代表性表站、里站与污染 `0—3` 场景各取样五次，使用 Chromium 模拟四倍 CPU 限速、1.6 Mbps 下行与 150 ms RTT，并输出中位数、P95、滚动帧间隔、功能支持和原始样本 JSON。可用 `PERF_BASE_URL` 指向静态预览，以 `PERF_RUNS`、`PERF_CPU_RATE`、`PERF_FRAME_COUNT`、`PERF_NETWORK_PROFILE=mobile4g|none` 和逗号分隔的 `PERF_SCENARIOS` 控制复测；`PERF_BROWSERS=chromium,chrome,firefox,webkit,edge` 选择引擎，Chrome 与 Edge 路径可分别由 `PERF_CHROME_EXECUTABLE_PATH` 和 `PERF_EDGE_EXECUTABLE_PATH` 指定。跨引擎比较必须使用 `PERF_CPU_RATE=1 PERF_NETWORK_PROFILE=none`，因为 CDP 限频、限速与渲染指标只适用于 Chromium 系。该脚本提供版本间相对证据，不替代真实设备和 Safari 验收。

只有工具链变更、跨层集成、准备合并或发布、进入正式候选阶段才执行完整门禁：

```bash
npm run verify
```

`verify` 已经包含完整质量检查、状态验证、一次 `showcase` 构建和静态产物验证。同一轮不得先运行这些子门禁再运行 `verify`，也不得重复相同 profile 的构建或产物验证；阶段门禁明确要求完整 `preview` 时，可在 `verify` 后只补一次 `preview` locale、构建、产物与浏览器检查。

现有分层 CSS 按共享基础、表站、里站、票务和污染组织；CSS 的语法、无效值、重复规则和高置信缺陷由 Stylelint 负责。自动修复后仍需检查 diff，不能把工具输出直接视为人工验收。

## 蓝图定位

修改功能源码前，从路径反查其主要和相关蓝图：

```bash
npm run blueprint:where -- src/pages/[routePrefix]/search/index.astro
```

修改蓝图时，列出直接及传递依赖的候选影响范围：

```bash
npm run blueprint:impact -- BP-MOD-SEARCH
```

候选范围只表示“需要判断”，不表示每个文件都必须修改。新增、删除或重命名功能源码时更新 `docs/blueprint/traceability.json`；蓝图内容和字段说明见 `docs/blueprint/README.md`。

## 扩展演出内容

剧目事实按来源位于 `src/data/productions/folio.ts` 与 `src/data/productions/original.ts`，并由 `src/data/productions/index.ts` 提供统一入口；场次和地点事实分别位于 `src/data/performances.ts` 与 `src/data/locations.ts`，面向访客的名称与正文位于 `src/data/localized/<editionId>/`。扩展内容时遵守 `BP-FND-DOMAIN`、`BP-I18N-CORE` 与 `BP-MOD-PROGRAMS`：

1. 为剧目和场次分别使用稳定 ID，把日期、地点、场次状态、票务可用性、分区与基础价格保留在 `Performance`；
2. 使用稳定 ID 在本地化内容包中补齐名称和正文，让列表、详情、搜索和票务输入从同一解析结果派生，不在页面或模组中复制正文；
3. 为场次提供 `effectiveDateTime`，让统一构建快照按对应世界的网站泰拉时钟派生本季与历史；运营状态不替代日期分类，也不读取浏览器现实时间；
4. 新视觉同时核对相关列表、详情、表站或里站样式和窄屏表现；
5. 不恢复旧混合 `Show`，也不在页面、搜索或票务中建立第二套可编辑内容源。

## 新增交互

- 将稳定内容放入 `data/`，构建期结构放入 `components/`，DOM 行为放入最接近用户能力的 `scripts/` 模块；
- 新模块只导出其他模块真正需要的接口，并由当前页面的明确客户端入口初始化；页面没有该能力的根节点时安全跳过；
- 不使用未声明的全局变量，不从一个功能模块直接修改另一个模块的私有状态；
- `main.css` 只装配共享基础；表站、里站、票务和污染规则分别进入同名职责文件，并由对应布局或能力组件按需装配，不跨文件保存平行令牌事实；
- 同时处理键盘操作、焦点、减少动态效果和 JavaScript 失败路径。

## 最小验证

1. 对本次改动路径运行 `npm run quality -- <路径...>`；该命令包含作用域内的补丁空白检查；
2. 纯文档变更到此结束，不执行构建或预览；
3. 运行时源码影响产物时，相关质量检查通过后运行一次 `npm run build`；
4. 检查受影响的生成 HTML、ID、锚点和本地资源；
5. 视觉或交互发生变化时使用 `npm run preview`，按风险检查桌面、窄屏、控制台和相关用户流程；
6. 达到完整门禁条件时，以一次 `npm run verify` 取代前述独立质量与构建命令，不重复相同步骤。
