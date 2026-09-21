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

| 预设       | 开发命令                              | 构建命令                                   | 当前用途                   |
| ---------- | ------------------------------------- | ------------------------------------------ | -------------------------- |
| `showcase` | `npm run dev:showcase`                | `npm run build` / `npm run build:showcase` | 炎国可部署展示             |
| `preview`  | `npm run dev` / `npm run dev:preview` | `npm run build:preview`                    | 九国家版本完整开发预览     |
| `release`  | `npm run dev:release`                 | `npm run build:release`                    | 只接受摘要匹配的已批准内容 |

不得另设自由组合环境变量改变国家版本、根集合或内容资格。`release` 失败时以内容门禁列出的稳定 ID 和原因为准。

`npm run preview` 只服务当前 `dist/`，不选择或重建预设。需要验收九版本静态产物时，先运行 `npm run build:preview`；若其后又运行 `npm run build` 或 `npm run verify`，`dist/` 会恢复为单版本 `showcase`，此时应重新执行一次 `build:preview`。

锁文件未变化时，自动化环境和全新工作区应优先使用 `npm ci`，避免安装结果漂移。

### 开发热更新排障

开发服务器或 HMR 相关改动使用 `npm run validate:dev:hmr`。命令启动独立临时端口的开发服务器，三轮触碰双站 CSS 与海报组件的修改时间（不改文件内容），检查真实浏览器更新消息、页面响应和服务端错误日志，最后核对源码摘要并关闭测试进程。运行时不要并行编辑这些文件；它不替换已有开发服务器，也不参与每次静态构建。

浏览器未报错与 HTTP 200 不能证明 HMR 正常：Astro 可能捕获路由更新异常后继续服务既有页面。若出现 `Failed to update routes via HMR`，应保存终端日志并检查框架版本，而不是隐藏错误或关闭文件监听。Astro 7.2.3 的路由虚拟模块循环依赖已有[上游修复](https://github.com/withastro/astro/pull/17787)，本项目锁定包含该修复的 7.2.10。依赖安装完成后先停止旧开发进程，再执行 `npm run dev`；安装新版本不会替换已加载的旧进程模块。

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
| `npm run quality:full`                     | 检查创意审查记录及触发测试，再执行完整静态检查；不构建   |
| `npm run measure:performance`              | 对正在运行的本地站点执行限速、限频性能取样               |
| `npm run build`                            | 只生成 `dist/`，不调用质量命令                           |
| `npm run build:showcase`                   | 显式生成炎国未批准展示产物                               |
| `npm run build:preview`                    | 生成当前九国家版本预览产物                               |
| `npm run build:release`                    | 生成摘要匹配的批准内容正式产物                           |
| `npm run validate:content`                 | 检查九国家版本内容闭包、源修订、素材摘要与批准漂移       |
| `npm run validate:content:showcase`        | 只对炎国展示集合执行同一聚焦内容门禁                     |
| `npm run validate:content:preview`         | 显式对九国家版本预览执行同一聚焦内容门禁                 |
| `npm run validate:content:release`         | 对正式集合执行内容与批准摘要门禁                         |
| `npm run validate:states`                  | 确定性检查污染、票务状态与纪念票字段                     |
| `npm run validate:dev:hmr`                 | 检查开发端三轮热更新、服务端日志与浏览器响应             |
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

`quality` 每次先核对全局创意指纹（包括限定 CSS／文档路径及干净工作区）；无变化只做离线摘要比较。它再按以下规则调度其他检查：

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

`measure:performance` 对正在运行的静态预览取样，标准输出是含原始样本、中位数和样本 P95 的 JSON，标准错误显示场景进度。默认 `PERF_BASE_URL=http://127.0.0.1:4321`、每场景五次、Chromium 四倍 CPU 限速；桌面为 1440×900 / DPR1，移动视口为 390×844 / DPR2。它不是实体手机模拟或线上 Web Vitals，也不以滚动帧间隔代替 INP。

使用 `PERF_RUNS`、`PERF_CPU_RATE`、`PERF_FRAME_COUNT` 和逗号分隔的 `PERF_SCENARIOS` 缩小复测；未知场景会报错，避免拼写错误导致漏测。默认场景覆盖炎国双站、票务和污染 0—3。可用 `PERF_SCENARIOS=higashi-front-mobile,minos-tickets-mobile,ursus-archive-mobile` 显式选择多语言代表；这些非炎语场景须先构建 `preview`。网络由 `PERF_NETWORK_PROFILE` 选择，仅 Chromium 系可限速：

| 值                 | 延迟   | 下行 / 上行              | 用途                     |
| ------------------ | ------ | ------------------------ | ------------------------ |
| `mobile4g`（默认） | 150ms  | 1.6 / 0.75 Mbps，均取90% | 保留已有受控移动网络基线 |
| `mobile3g`         | 400ms  | 0.4 / 0.4 Mbps，均取90%  | 较弱移动连接             |
| `wifi`             | 20ms   | 40 / 10 Mbps             | 受控高速无线连接         |
| `none`             | 不模拟 | 不模拟                   | 引擎间功能与渲染比较     |

例如，对同一构建的两个首页在移动网络下取三次样本：

```bash
mkdir -p .agent-work
PERF_BASE_URL=http://127.0.0.1:4321 PERF_RUNS=3 PERF_SCENARIOS=front-home-mobile,archive-home-l2-mobile npm run --silent measure:performance > .agent-work/performance.json
```

`pageTransfer` 包含导航 HTML 和初始采样时已经完成的子资源，`resourceTransfer` 只含子资源；固定滚动后的传输另记为 `scrollPageTransfer`，并报告资源是否已静止。Resource Timing 不保证包含被中止图片已传输的字节，因此保留 `imageRequestAborts`，不能把它解释成总线字节精确计数。图片被替换导致的中止与其他网络失败、HTTP错误和页面异常分别报告；后几项、首屏图像等待超时、目标污染等级未生效或滚动后资源未静止会让命令返回非零退出码，但仍输出诊断 JSON。滚动后最多等待60秒，超时的 `scrollPageTransfer` 输出 `null` 并从统计中排除。

`stateApplied` 是首次观测到目标污染等级的时间上界，`stateSettleDuration` 是之后两个动画帧的间隔，不代表图像已经显示。首屏图像先确认已载入且与污染等级一致，再进行初始采样；`viewportImagesReadyAt` 是 `load` 后的就绪确认上界，不是新增的 Web Vital。CLS 按[最大会话窗口](https://web.dev/articles/cls)统计（相邻位移间隔少于1秒，窗口不超过5秒），只描述本次采样区间；不支持的指标输出 `null`。前后比较必须使用相同脚本、浏览器、构建预设、视口/DPR、网络、CPU与样本数，不用单次最快值代表改进。

`PERF_BROWSERS=chromium,chrome,firefox,webkit,edge` 选择引擎；Chrome 与 Edge 路径分别由 `PERF_CHROME_EXECUTABLE_PATH` 和 `PERF_EDGE_EXECUTABLE_PATH` 指定。跨引擎比较使用 `PERF_CPU_RATE=1 PERF_NETWORK_PROFILE=none`，因为 Firefox/WebKit 没有相同的 CDP 限速与渲染指标。Playwright WebKit 不替代真实 Safari；缓存、CDN压缩和真实设备体验须在对应部署环境单独核验。

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

创意变化后，智能体主动执行[演出创意审查与替换](creative-content-review.md)，包括泰拉年鉴、官方设定、内部一致性、快照及 AI 预览翻译；无需再次请求审查授权。`npm run review:creative:plan` 输出待审范围及指纹；实际审查后执行 `npm run review:creative:record -- <报告.json>`。`quality`（任何限定路径）、`quality:full` 与 `verify` 均对完整输入自动检查记录；无变化只做离线比较，不重复 AI 审查。纯排版或等价重构须有明确的无创意变化判断，不能盲目更新指纹。`npm run test:creative-review`、`npm run test:quality` 与 `npm run test:content-lifecycle` 分别验证证据触发与显式消项、限定路径的全局检查、演出新增／撤选／删除边界，均已纳入完整质量门禁。

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

## PR 自动检查

`.github/workflows/quality.yml` 对目标为 `dev_code`、`dev`、`main` 的 PR、这些分支的 push 和手动触发执行 `verify` 作业：Node.js 24、锁定依赖安装、一次 `npm run verify`，再检查全部九版本 `validate:locales:preview`。PR 使用 GitHub 的合并候选与完整 Git 历史检出，通过 `CREATIVE_REVIEW_BASE_REF` 指定该 PR 的目标提交；同时核对目标记录到候选记录的发现闭环，防止直接编辑 JSON 静默清空旧问题。目标分支更新导致指纹变化时，应在工作分支正常同步并实际补审，不在 CI 中自动生成通过记录。工作流仅有 `contents: read`，不调用 AI、不使用发布凭据、不部署，也不定时抓取官方资料。行为依据见 [GitHub PR 事件说明](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request)。

要由平台强制阻止失败合并，仓库管理者还须将该工作流的 `verify` 检查设为目标分支必需检查，并要求与目标分支保持最新；工作流文件本身不设置远端保护规则。该规则配置与真实 Git 晋级仍遵守人工授权边界。

准备 PR 时，在本地将 `CREATIVE_REVIEW_BASE_REF` 设为实际目标提交或已更新的远端跟踪引用，并运行 `review:creative:plan`、实际补审、`review:creative:record` 和最终门禁。例如 `CREATIVE_REVIEW_BASE_REF=origin/dev_code npm run review:creative`。若目标分支尚未接入记录，允许建立首轮基线；已有记录则不能在候选中省略旧发现而不提供消项证据。多轮本地审查须保留针对目标记录仍然需要的消项说明，直到该目标已接收更改。
