# 五国家版本技术预览一次性开发计划

- 文档类型：一次性开发计划
- 状态：候选，等待正式蓝图迁移与人工执行授权
- 规划效力：只约束本计划的切片顺序，不覆盖正式蓝图；当前不得据此修改源码
- 分析基线：`dev_blueprint` 的 `5cabee1c1ab1b77dc196c81fee4d2440e67247f3`、当前 active 蓝图、`docs/drafts/blueprint/minos-ursus-localization-preview.md` 与 `docs/drafts/recommendations/stage-code-audit-defense.md`
- 目的：以最小且可回退的源码切片落实共享正确性修正，并依次完成米诺斯和乌萨斯双时间层技术预览，形成可部署、可验证的五国家版本网站
- 非目标：不认可 AI 译文为正式翻译，不修改 `releaseEditionIds = ['yan']`，不开发其他国家版本，不在本阶段实现真实内容变体、首次批准摘要重构、完整 Artwork/Seating 闭包或通用依赖分层

## 正文

### 可执行性结论

当前材料足以形成无需执行者猜测产品意图的一次性计划：两个草稿均无未解决问题；米诺斯与乌萨斯的稳定 ID、URL、locale 和徽记已经注册；页面路由、搜索、票务和污染按国家版本参数化；新增语言可以通过完整包接入，不需要复制页面或状态机。审计发现的阶段阻塞项已有唯一技术处置，非本阶段问题也已从范围中排除。

当前唯一前置不是设计问题，而是效力门禁：正式蓝图仍规定三语言 preview。必须先按本计划的“执行前置”完成正式迁移，计划才可由“候选”改为“已批准执行”。迁移不作为源码切片，也不制造空的 `dev_code` 提交。

### PLAN-01｜五国家版本技术预览与必要审计修正

- 状态：候选
- 正式依据：当前 active 的 `BP-I18N-CORE`、`BP-I18N-TERMS`、`BP-CNT-CORE`、`BP-FND-CORE`、`BP-FND-EXPERIENCE`、`BP-MOD-SEARCH`、`BP-MOD-TICKETING`、`BP-MOD-ARCHIVE`、`BP-MOD-TERRA-TIME` 与 `BP-QLT-STAGES`；草稿差异必须在执行前正式迁入这些 ID
- 范围：构建上下文与日期/世界校验、可扩展本地化解析、共享渐进增强与可访问性、Unicode 票面、最小质量门禁、米诺斯现代希腊语、乌萨斯俄语及最终五语言 preview
- 完成条件：`showcase` 仍只生成炎国；四语言中间态和五语言最终态分别严格通过；最终 preview 生成由路由集合推导的 156 个页面，五种语言功能等价、零缺失、零旧译、零 fallback；Node 24 静态门禁、构建产物和代表性浏览器矩阵通过；源码与正式蓝图重新同步

#### PLAN-01 执行前置

1. 人工明确授权正式迁移后，将 `docs/drafts/blueprint/minos-ursus-localization-preview.md` 的 `SET-01—05` 无损拆入上述 active 蓝图。
2. 从代码审计建议中只迁入本阶段实际采用的结论：
   - `REC-01` 的 context/root set 可执行关系、三个可部署 profile 的 strict 本地化解析、当前语言 build-scope 解析，以及九枚注册徽记常驻边界；
   - `REC-02` 的记录级作者诊断和快照范围翻译修订，不迁入首次批准摘要拆分；
   - `REC-03` 的根集合世界归属与 TerraDateTime 结构校验，不迁入 restricted-import；
   - `REC-04—05` 的共享 UX、可访问性、多文字系统和票面边界；
   - `REC-06` 的能力化质量调度、preview 补充链、代表性浏览器冒烟与远端载入防回归。
3. 仍有价值但未纳入本阶段的变体持久化、批准摘要、完整 Artwork/Seating 闭包和窄导入限制继续留在建议草稿，不因部分迁移而丢失或被误写成已完成。
4. 正式迁移后运行一次相关蓝图 `blueprint:impact` 和一次 `blueprint:check`，更新必要追踪与文档事实，删除已经迁移的草稿来源；在此之前不得把本计划改为“已批准执行”。
5. 后续每个源码切片遵循 `docs/guides/git-branch-workflow.md` 的逐切片双分支闭环。计划不复制该流程，也不自行授予 commit、push 或合并权限。

#### PLAN-01 执行切片

| 切片 ID    | 状态   | 可观察交付结果                                                                                                                                        | 前置依赖                        | 候选影响路径                                                                                                                                                                                                       | 验收方式                                                                                                                                                                        |
| ---------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SLICE-01` | 待开始 | 构建 context 唯一解析其 `rootSetId`；根集合成员/焦点跨世界及非法 TerraDateTime 在生成页面前失败                                                       | 执行前置完成                    | `src/data/content/build-context.ts`、`root-sets.ts`、`resolve.ts`、`validate.ts`、`src/data/site-time.ts`、内容与状态验证器                                                                                        | 负向夹具覆盖 front/archive 双向错置及 effective/previous/fixed/provider 非法输入；现有 12 个场次分类不变；相关最小质量、状态/内容检查及一次 showcase 构建通过                   |
| `SLICE-02` | 待开始 | 三个可部署 profile 严格拒绝记录缺失、旧译和 fallback；不可部署作者诊断可逐记录报告来源；现有三语言包使用同一目录职责；修订只影响快照内相关记录/消息组 | `SLICE-01` 已回到蓝图分支并收口 | `src/data/localized/schema.ts`、`resolve.ts`、`packages.ts`、现有三语言目录、`src/data/content/localization-revisions.ts`、内容/locale 验证器                                                                      | 删除或制造旧译的单条记录时 strict 失败而诊断报告来源；集合外记录不使现有语言整包过期；三语言 preview 零 fallback；相关最小质量和一次 preview 构建/产物验证通过                  |
| `SLICE-03` | 待开始 | 搜索初始化失败只有一个可理解降级；票务阶段焦点具有本地化标题；三级投影不抢 H1 或焦点；选择器读出当前版本和选择动作                                    | `SLICE-02` 已回到蓝图分支并收口 | `SiteSearch.astro`、`site-search.ts`、`TicketingExperience.astro`、`ticketing-controller.ts`、`ArchiveProjection.astro`、`ArchiveLayout.astro`、`pollution-controller.ts`、`EditionSelector.astro`、三语言消息内容 | 当前三语言下完成正常/无 JS/搜索初始化失败、票务主要阶段焦点、等级 3 简短公告、选择器键盘与 Escape；相关最小质量和一次 preview 构建通过                                          |
| `SLICE-04` | 待开始 | 纪念票使用 Unicode 字素安全的确定性换行与字号下限；长日文、俄文、希腊文测试输入不覆盖二维码或删除关键事实                                             | `SLICE-03` 已回到蓝图分支并收口 | `src/scripts/ticket-artifact.ts`、票面相关 schema/消息、`src/styles/ticketing.css`、状态验证器                                                                                                                     | 日文无空格、俄文长词、希腊文组合符的屏幕 SVG、下载与打印边界通过；票号、二维码和结局语义不变；相关最小质量和一次 preview 构建通过                                               |
| `SLICE-05` | 待开始 | 质量调度能按能力触发 preview locale/内容检查；阶段拥有单一轻量浏览器冒烟入口；产物门禁覆盖常见远端自动请求、嵌入和 CSS URL 且不误伤普通链接           | `SLICE-04` 已回到蓝图分支并收口 | `scripts/quality.mjs`、`validate-locales.mjs`、`validate-build.mjs`、`validate-states.mjs`、候选 `scripts/validate-browser.mjs`、`package.json`、`package-lock.json`、必要 ignore/指南                             | `quality -- --plan` 证明纯文档不跑代码、i18n 改动不漏 locale 且不无故双构建；工具链变更只运行一次 `verify`；浏览器冒烟可复现且不生成入库截图/报告                               |
| `SLICE-06` | 待开始 | 米诺斯完整 AI 现代希腊语包、`el` 系统字体和四语言选择器投入 preview；其他三语言行为不退化                                                             | `SLICE-05` 已回到蓝图分支并收口 | 新增 `src/data/localized/minos/`；`src/data/editions.ts`、`localized/packages.ts`、修订与 locale 验证、`foundation.css`、追踪文件                                                                                  | 四语言 preview 推导并生成 125 页；米诺斯零缺失/旧译/fallback/意外汉字且主要类别含 Greek；希腊文查询、320px 表站票务/里站、切换、下载与打印通过                                  |
| `SLICE-07` | 待开始 | 乌萨斯完整 AI 俄语包、`ru` 系统字体和最终五语言选择器投入 preview，并完成五语言交叉收口                                                               | `SLICE-06` 已回到蓝图分支并收口 | 新增 `src/data/localized/ursus/`；`src/data/editions.ts`、`localized/packages.ts`、修订与 locale 验证、`foundation.css`、README/架构/指南、追踪文件                                                                | 五语言 preview 推导并生成 156 页；乌萨斯零缺失/旧译/fallback/意外汉字且主要类别含 Cyrillic；俄文查询、320px 表站票务/里站及五语言跨版本状态、搜索隔离、下载、打印和污染退出通过 |

#### PLAN-01 切片边界

- `SLICE-01` 只让已有内容事实被正确拒绝或接受，不改当前场次、地点、日期、世界归属或可见页面。
- `SLICE-02` 可以机械移动炎国和哥伦比亚原创剧目译文以统一职责，但不得重写逐字内容；不得为修订粒度顺手实现内容批准或完整变体系统。
- `SLICE-03` 只修复已经确认的语义与降级问题，不改变搜索匹配、票务分支、污染等级、国家切换目标或视觉叙事方向。
- `SLICE-04` 只改变票面排版容错，不增加新票面字段、下载格式、图片资产或文案审批要求。
- `SLICE-05` 使用一个轻量浏览器入口覆盖代表性任务，不建立全语言乘全路由截图系统。若仓库缺少可复用浏览器驱动，只增加一个必要开发依赖和一个脚本入口，不同时引入第二套测试框架。
- `SLICE-06` 只加入米诺斯，不预建乌萨斯空包或选择器占位；`SLICE-07` 才加入乌萨斯。每个语言切片必须独立完整，不能依赖炎语 fallback 让中间构建通过。
- 九枚已注册国家徽记继续常驻所有构建产物；切片不得为其增加按 profile 条件化资源逻辑。选择器选项和页面仍只来自当前构建集合。

#### PLAN-01 最小验证与最终收口

- 每个切片先运行 `npm run quality -- <实际改动路径...>`；只追加该切片改变的内容、状态、locale、构建或浏览器检查，不在同一轮重复 `quality:full`、相同 profile 构建或相同产物验证。
- 共享运行时切片使用满足风险的单次 showcase 或 preview 构建；语言切片只构建对应 preview。工具链切片按规范运行一次 `verify`，后续语言改动不引用旧结果冒充新验证。
- `SLICE-07` 结束时运行一次当前 `verify`。由于该命令已经覆盖完整质量、preview 内容、状态、showcase locale/build/output，随后只补 `validate:locales:preview`、一次 `build:preview`、`validate:build:preview` 和五语言浏览器冒烟；不得再运行第二次完整质量或 showcase 构建。
- 最终浏览器矩阵至少包含桌面表站、320px 表站票务、320px 里站，日/希/俄最长头部，选择器键盘和无 JS，搜索初始化失败，票务焦点与票面，减少动态效果、污染升级和可靠退出；联合检查 `scrollWidth`、关键元素及焦点边界。
- `dev_code` 完成最终切片并同步回 `dev_blueprint` 后，蓝图分支只根据真实实现更新阶段描述、架构快照、开发指南、README、追踪和计划状态；没有独立源码结果的“最终检查”不制造第八个代码提交。
- 全部完成且没有遗留未验证项后删除本计划。代码审计建议中未纳入本阶段的正文继续保留，等待未来独立规划；不把计划日志迁入正式蓝图。

## 待解决问题

无。正式蓝图迁移和 Git/自动执行授权是既有人工门禁，不是尚未决定的产品问题；未获得对应授权前，本计划保持候选且不得执行。

## 正式拆分与影响定位

| 来源 ID        | 目标位置                                                                                                                               | 影响性质       | 确认后的动作                                                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ----------------------------------------------------------------- |
| `PLAN-01`      | 上述 active 蓝图、`src/data/content/`、`src/data/localized/`、共享组件/脚本、质量验证与两种新语言目录                                  | 一次性实施编排 | 正式蓝图迁移并获计划执行授权后，按 `SLICE-01—07` 逐项实现和回合并 |
| `PLAN-01` 收口 | `docs/blueprint/traceability.json`、`README.md`、`docs/architecture/repository-structure.md`、`docs/guides/development.md`、本计划文件 | 修正、删除     | 只按最终实现更新长期事实；完成核对后删除本计划，不迁移执行日志    |
