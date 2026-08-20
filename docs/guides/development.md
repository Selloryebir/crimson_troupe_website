# 开发指南

执行 Git 写操作或开始新的蓝图、源码阶段前，先阅读 [`git-branch-workflow.md`](git-branch-workflow.md)，确认当前分支职责和允许的同步方向。

## 本地运行

项目要求 Node.js 24 LTS 和 npm。在仓库根目录首次执行：

```bash
npm install
npm run dev
```

访问终端输出的本地地址。不要直接打开生成前的 `.astro` 文件。

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

| 命令                               | 职责                                                     |
| ---------------------------------- | -------------------------------------------------------- |
| `npm run quality -- <路径>`        | 按实际改动调度最小必要检查                               |
| `npm run quality:docs`             | 显式检查全部受管文档格式                                 |
| `npm run quality:blueprint`        | 显式检查正式蓝图格式及追踪关系                           |
| `npm run quality:code`             | 显式检查全部 Astro/TypeScript、ESLint 与源码格式         |
| `npm run quality:styles`           | 显式检查全部 CSS                                         |
| `npm run quality:full`             | 执行一次蓝图、类型、代码、样式与全仓格式检查，不执行构建 |
| `npm run build`                    | 只生成 `dist/`，不调用质量命令                           |
| `npm run build:preview`            | 生成炎国、东国与哥伦比亚三语言预览产物                   |
| `npm run validate:states`          | 确定性检查污染、票务状态与纪念票字段                     |
| `npm run validate:locales`         | 检查正式构建国家版本的本地化覆盖                         |
| `npm run validate:locales:preview` | 检查三语言预览构建的本地化覆盖                           |
| `npm run validate:build`           | 检查已生成页面的路由、元数据、链接、资源与发布范围       |
| `npm run validate:build:preview`   | 检查三语言预览产物的路由、元数据、链接与隔离范围         |
| `npm run verify`                   | 依次执行完整质量、状态、一次构建与静态产物门禁           |
| `npm run lint:code:fix`            | 自动修复 ESLint 明确支持的代码问题                       |
| `npm run lint:styles:fix`          | 自动修复 Stylelint 明确支持的样式问题                    |
| `npm run format`                   | 格式化 Astro、TypeScript、配置和文档，不改手工组织的 CSS |
| `npm run blueprint:check`          | 检查蓝图 ID、依赖、路径和源码覆盖关系                    |

`quality` 的最小调度规则如下：

| 变更范围                       | 自动检查                                             |
| ------------------------------ | ---------------------------------------------------- |
| 草稿或普通说明文档             | 补丁空白、变更文件 Prettier                          |
| `docs/blueprint/`              | 文档检查、`blueprint:check`                          |
| 现有 `.ts`、`.astro`           | 项目级 Astro/TypeScript、变更文件 ESLint 与 Prettier |
| 现有 `.css`                    | 变更文件 Stylelint                                   |
| 功能源码新增、删除或重命名     | 对应源码检查、`blueprint:check`                      |
| 工具链或质量配置               | `verify`                                             |
| 多个运行时层，或蓝图与实现同步 | `verify`                                             |

Astro/TypeScript 类型关系可能跨文件，因此代码变更仍使用项目级 `astro check`；ESLint、Stylelint 和 Prettier 可以安全地限制为变更文件。`quality` 不负责运行普通构建或浏览器验收；运行时源码完成一个可交付切片后，先通过相关质量检查，再单独运行一次 `npm run build`。

只有工具链变更、跨层集成、准备合并或发布、进入正式候选阶段才执行完整门禁：

```bash
npm run verify
```

`verify` 已经包含完整质量检查、状态验证、一次构建和静态产物验证。同一轮不得先运行这些子门禁再运行 `verify`，也不得在 `verify` 后重复运行 `build` 或产物验证。

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

稳定演出事实分别位于 `src/data/productions.ts` 与 `src/data/performances.ts`，地点事实位于 `src/data/locations.ts`；面向访客的名称与正文位于 `src/data/localized/<editionId>/`。扩展内容时遵守 `BP-FND-DOMAIN`、`BP-I18N-CORE` 与 `BP-MOD-PROGRAMS`：

1. 为剧目和场次分别使用稳定 ID，把日期、地点、场次状态、票务可用性、分区与基础价格保留在 `Performance`；
2. 使用稳定 ID 在本地化内容包中补齐名称和正文，让列表、详情、搜索和票务输入从同一解析结果派生，不在页面或模组中复制正文；
3. 本季与历史归属使用明确世界视角和内容状态，不读取浏览器现实时间；
4. 新视觉同时核对相关列表、详情、表站或里站样式和窄屏表现；
5. 不恢复旧混合 `Show`，也不在页面、搜索或票务中建立第二套可编辑内容源。

## 新增交互

- 将稳定内容放入 `data/`，构建期结构放入 `components/`，DOM 行为放入最接近用户能力的 `scripts/` 模块；
- 新模块只导出其他模块真正需要的接口，并由当前页面的明确客户端入口初始化；页面没有该能力的根节点时安全跳过；
- 不使用未声明的全局变量，不从一个功能模块直接修改另一个模块的私有状态；
- `main.css` 只装配样式；共享基础、表站、里站、票务和污染规则分别进入同名职责文件，不跨文件保存平行令牌事实；
- 同时处理键盘操作、焦点、减少动态效果和 JavaScript 失败路径。

## 最小验证

1. 对本次改动路径运行 `npm run quality -- <路径...>`；该命令包含作用域内的补丁空白检查；
2. 纯文档变更到此结束，不执行构建或预览；
3. 运行时源码影响产物时，相关质量检查通过后运行一次 `npm run build`；
4. 检查受影响的生成 HTML、ID、锚点和本地资源；
5. 视觉或交互发生变化时使用 `npm run preview`，按风险检查桌面、窄屏、控制台和相关用户流程；
6. 达到完整门禁条件时，以一次 `npm run verify` 取代前述独立质量与构建命令，不重复相同步骤。
