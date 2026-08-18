# 开发指南

## 本地运行

项目要求 Node.js 24 LTS 和 npm。在仓库根目录首次执行：

```bash
npm install
npm run dev
```

访问终端输出的本地地址。不要直接打开生成前的 `.astro` 文件。

锁文件未变化时，自动化环境和全新工作区应优先使用 `npm ci`，避免安装结果漂移。

## 质量命令

提交前执行统一质量门禁：

```bash
npm run quality
```

它依次执行 Astro/TypeScript 类型检查、ESLint、Stylelint 和 Prettier 格式检查。各命令的职责如下：

| 命令                      | 职责                                  |
| ------------------------- | ------------------------------------- |
| `npm run check`           | 检查 Astro 模板与 TypeScript 类型     |
| `npm run lint`            | 检查 TypeScript、Astro 与分层 CSS     |
| `npm run lint:code:fix`   | 自动修复 ESLint 明确支持的代码问题    |
| `npm run lint:styles:fix` | 自动修复 Stylelint 明确支持的样式问题 |
| `npm run format`          | 格式化 Astro、TypeScript、配置和文档  |
| `npm run format:check`    | 只检查格式，不写入文件                |
| `npm run quality`         | 汇总类型、代码、样式与格式检查        |
| `npm run build`           | 先通过完整质量门禁，再生成 `dist/`    |

现有分层 CSS 保留按视觉责任组织的手工分组，不由 Prettier 整库重排；CSS 的语法、无效值、重复规则和高置信缺陷由 Stylelint 负责。自动修复后仍需检查 diff，不能把工具输出直接视为人工验收。

## 新增剧目

1. 在 `src/data/shows.ts` 添加完整剧目数据；TypeScript 会约束月份、城市、视觉类型和必填内容；
2. 节目卡、详情初始内容、搜索结果和预约选项由同一数据源生成，不在组件中复制剧目正文；
3. 如需新的主视觉类型，扩展 `ShowVisual`，并在 `ProgramCard.astro`、`front.css` 与 `overlays.css` 中补充表现；
4. 执行类型检查，并验证筛选数量、搜索结果、详情内容及预约衔接。

## 新增交互

- 将稳定内容放入 `data/`，构建期结构放入 `components/`，DOM 行为放入最接近用户能力的 `scripts/` 模块；
- 新模块只导出其他模块真正需要的接口，并由 `main.ts` 初始化；
- 不使用未声明的全局变量，不从一个功能模块直接修改另一个模块的私有状态；
- 新增浮层样式放入 `overlays.css`，页面业务样式按时间层归属；
- 同时处理键盘操作、焦点、减少动态效果和 JavaScript 失败路径。

## 最小验证

1. `git diff --check`，并检查新增文件没有尾随空白；
2. `npm run quality`；
3. `npm run build`；
4. 检查生成 HTML 的 ID、锚点和本地资源；
5. 使用 `npm run preview` 在桌面与不大于 500px 的视口检查页面；
6. 检查浏览器控制台无模块加载或运行错误；
7. 按改动范围验证筛选、搜索、详情、预约、档案和世界切换。
