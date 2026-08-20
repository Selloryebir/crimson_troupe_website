# 三语言活页节目预览一次性开发计划

- 文档类型：一次性开发计划
- 状态：已批准执行
- 规划效力：只约束本计划的切片顺序、分支往返和阶段验收，不覆盖正式蓝图
- 分析基线：已经接收本阶段正式契约的 `BP-FND-CORE`、`BP-FND-DOMAIN`、`BP-FND-EXPERIENCE`、`BP-CNT-CORE`、`BP-MOD-PROGRAMS`、`BP-I18N-CORE`、`BP-I18N-TERMS`、`BP-QLT-STAGES`，`docs/references/production-title-reference.md`，当前双语言源码，以及只保留 `TEST-01` 的 `docs/drafts/blueprint/higashi-trilingual-preview.md`
- 目的：以四个独立、可构建、可回滚定位的源码切片完成剧目来源解耦、1091 里站活页节目替换、东国语第三语言接入和日文响应式验收，并保证每个切片在 `dev_code` 独立提交后同步回 `dev_blueprint`
- 非目标：发布哥伦比亚语或东国语；审核 AI 译文准确性；重写既有双时间层视觉体系；引入 Web Font、前端框架、菜单库、CMS、翻译平台或动态文件扫描；将四个切片压缩为一次实现提交

## 正文

### PLAN-01｜三语言活页节目预览

- 状态：已批准执行
- 正式依据：`BP-FND-CORE`、`BP-FND-DOMAIN`、`BP-FND-EXPERIENCE`、`BP-CNT-CORE`、`BP-MOD-PROGRAMS`、`BP-I18N-CORE`、`BP-I18N-TERMS`、`BP-QLT-STAGES`
- 范围：剧目来源与本地化包结构、活页稳定 ID、地点国家归属、九次里站场次、炎国/哥伦比亚既有内容适配、东国语完整内容包、三语言选择器、功能等价验证、日文系统字体与响应式修正
- 完成条件：四个源码切片分别完成独立提交、推送、回合并和蓝图分支状态更新；正式构建仍只发布炎国，三语言预览零回退且双时间层功能等价；`TEST-01` 已由可部署页面验证并关闭；最终完整门禁、预览增量门禁与人工视觉验收通过；计划完成后按草稿生命周期删除

#### PLAN-01 执行前置

正式蓝图迁移已经完成，活页标题由唯一参考保存，迁移后的正文不在草稿中保留副本。开始 `S1` 前只需满足：

1. 当前 `dev_blueprint` 已保存并推送通过检查的正式迁移结果；
2. 人工明确授权按本计划执行源码开发及双分支逐切片闭环，再把 `S1` 标记为“已批准待同步”。

#### PLAN-01 切片状态与双分支往返规则

所有 `S*` 都是独立源码切片，状态及自动执行决策边界使用 `docs/drafts/plans/README.md` 的长期规则，并完整遵守 `docs/guides/git-branch-workflow.md` 的“逐切片闭环”。本计划不另行定义分支流程，也不自行授予 Git 写入；人工后续若明确授权端到端自动执行，则按两份长期规范连续推进。

`S4` 回合并后，`dev_blueprint` 关闭 `TEST-01`、同步必要正式蓝图并完成最终状态收口；确认无剩余计划工作后，另行删除本计划并更新 `docs/drafts/README.md`，用最终清理提交结束生命周期。

#### PLAN-01 执行切片

| 切片 ID | 状态         | 可观察交付结果                                                                                       | 前置依赖     | 候选影响路径                                                                                                                                                                                                                                                                 | 验收方式                                                                                              |
| ------- | ------------ | ---------------------------------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `S1`    | 已批准待同步 | 现有双语言行为不变，但剧目事实、国家版本包和验证注册具备单入口与后续来源分区能力                     | 人工批准执行 | `src/data/productions.ts`、候选 `src/data/productions/`、`src/data/localized/schema.ts`、`src/data/localized/resolve.ts`、候选 `src/data/localized/yan/index.ts`、候选 `src/data/localized/columbia/index.ts`、`scripts/validate-locales.mjs`、追踪表                        | 变更路径质量检查；炎国正式 locale/状态/构建门禁；既有炎国+哥伦比亚预览 locale、构建与产物门禁全部通过 |
| `S2`    | 待开始       | 六项原创内容保留，四项活页剧目和六地点九场里站节目在炎国与哥伦比亚预览中完整可浏览、可搜索且不可购票 | `S1` 已完成  | 候选剧目来源模块、`src/data/locations.ts`、`src/data/performances.ts`、候选 `src/data/localized/{yan,columbia}/productions/`、`src/data/localized/{yan,columbia}/programs.ts`、`src/data/site-search-index.ts`、`scripts/validate-locales.mjs`、`scripts/validate-build.mjs` | 变更路径质量检查；来源类别、九场次数和国家分布断言；正式与双语言预览 locale、状态、构建和产物验证通过 |
| `S3`    | 待开始       | `hig / ja-JP` 完整加入开发预览，三语言选择器与双时间层全部页面、内容、搜索、票务和污染状态实现等价   | `S2` 已完成  | `src/data/editions.ts`、候选 `src/data/localized/higashi/`、`src/data/localized/resolve.ts`、`src/components/shared/EditionSelector.astro`、`scripts/validate-locales.mjs`、`scripts/validate-states.mjs`、`scripts/validate-build.mjs`、开发命令和相关说明                  | 变更路径质量检查；正式炎国构建不变；三语言预览零回退、页面/链接/搜索隔离、跨语言票篮与污染状态通过    |
| `S4`    | 待开始       | 日文系统字体、换行与共享响应式模式经真实页面修正；三语言双时间层功能矩阵和 `TEST-01` 完成最终验收    | `S3` 已完成  | `src/styles/foundation.css` 及实测证明必要的 `front.css`、`archive.css`、`ticketing.css`、`pollution.css`，必要的共享组件与验证脚本                                                                                                                                          | 一次完整 `verify`；预览独有 locale、构建和产物门禁；代表视口、键盘、无脚本、减少动态效果和打印验收    |

#### PLAN-01 S1｜索引与本地化包边界

- 将当前剧目事实迁入可扩展的唯一索引，保持六项既有剧目 ID、视觉和所有场次行为不变；此切片不添加活页剧目；
- 把 `LocalizationPackage` 等公共包类型放在中立 schema 层；炎国与哥伦比亚目录各暴露一个完整包入口，解析器每种语言只导入和注册一个包；
- 保持显式注册，不使用 glob、运行时路径拼接或按目录自动发现；
- 把 locale 验证中只针对哥伦比亚的特殊逻辑收束为可配置的 locale 规则，通用完整度、键集合和回退检查继续从构建集合派生；
- 新增、删除或重命名源码时同步追踪表。预期提交主题：`refactor(i18n): prepare production and locale package indexes`。

#### PLAN-01 S2｜双来源剧目与九场里站内容

- 在语言无关剧目层引入 `sourceKind: 'folio' | 'original'`，六项现有剧目进入 `original`，四项本阶段剧目按 `der-ring`、`one-hundred-and-one-days`、`the-carnival`、`ode-au-triomphe` 进入 `folio`；
- 炎国与哥伦比亚的剧目详情按来源分区维护并合并给现有消费者。活页标题使用 `docs/references/production-title-reference.md` 中的中文与 English 形式；其他字段可以为阶段测试内容；
- 新增 `zwillingsturme`、`londinium`、`calais-blason`、`montelupe`、`nuova-volsinii` 并复用 `wiesheim`；所有运行时地点补齐稳定国家归属，不从译文推断国家；
- 删除旧里站四次 `Performance`，但不删除其三个原创 `Production`；按 `BP-CNT-CORE` 的唯一九场矩阵新增场次，并使用下表冻结的 `performanceId` 与泰拉日期时间，全部保持 `historic-snapshot` 不可购票状态；
- 列表、详情、搜索和不可购票页继续从统一事实派生。验证断言里站只引用 `folio`，并按稳定地点国家字段核对指定次数；
- 新增、删除或重命名源码时同步追踪表。预期提交主题：`feat(content): add folio archive performance register`。

| `performanceId`                                    | 泰拉时间         |
| -------------------------------------------------- | ---------------- |
| `der-ring-calais-blason-1091-0308`                 | 1091-03-08 19:00 |
| `one-hundred-and-one-days-calais-blason-1091-0419` | 1091-04-19 18:30 |
| `the-carnival-wiesheim-1091-0511`                  | 1091-05-11 20:00 |
| `ode-au-triomphe-nuova-volsinii-1091-0623`         | 1091-06-23 19:30 |
| `der-ring-zwillingsturme-1091-0817`                | 1091-08-17 20:00 |
| `one-hundred-and-one-days-londinium-1091-0903`     | 1091-09-03 19:30 |
| `the-carnival-montelupe-1091-0921`                 | 1091-09-21 20:00 |
| `the-carnival-londinium-1091-1009`                 | 1091-10-09 19:00 |
| `ode-au-triomphe-zwillingsturme-1091-1028`         | 1091-10-28 18:45 |

#### PLAN-01 S3｜东国语完整内容与功能等价

- 新增东国语 `site`、`messages`、`programs` 和完整包入口；AI 日译覆盖页面元数据、导航、页脚、ARIA、搜索、筛选、票务、污染、无脚本、存单、纪念票、下载及打印可见文字；
- 活页剧目使用 `docs/references/production-title-reference.md` 已提供的日文标题，不重新机器翻译；地点、九次场次及其余测试详情按东国语页面语境补齐；
- 把 `higashi` 加入预览集合且保持正式发布集合只有 `yan`。三语言选择器按产品顺序显示 `炎语`、`極東語`、`Columbian`，继续使用 `HIG` 正方形临时标识和同页面普通链接；
- 通用页面、搜索、筛选、票务和污染消费者不得增加东国语专用分支；只有 locale 校验和字体排版允许按 `ja-JP` 明确配置；
- 状态验证遍历全部预览国家版本，证明稳定票篮、冻结结果和污染状态不保存显示语言；构建验证证明每种语言拥有相同页面类别、等价链接、正确 `lang`、canonical、robots 与独立搜索范围；
- 新增东国语内容包或其他功能源码时同步 `docs/blueprint/traceability.json`，不预填没有实际创建的候选路径；
- 预期提交主题：`feat(i18n): add complete Higashi preview edition`。

#### PLAN-01 S4｜日文视觉韧性与最终门禁

- 为 `ja-JP` 增加常见平台系统日文 serif/sans 字体顺序、正常日语禁则换行和必要的内容驱动尺寸；不引入 Web Font、固定译文特例或强制截断；
- 先检查表站首页、演出列表与详情、票务，以及里站首页、演出列表与详情、搜索和三语言选择器；修复作用于共享模式，只有确属文字系统的问题进入 `:lang(ja-JP)`；
- 自动门禁覆盖三个国家版本的双时间层页面、搜索隔离、筛选、表站票务、里站不可购票、污染切换、下载与打印文字、无脚本降级和 320px 视口安全；
- 浏览器检查至少覆盖 320、390、768 与 1280 CSS 像素，验证键盘焦点、`Escape`、减少动态效果、页面级横向外溢、标题换行、假名行高、`Zwillingstürme` 字形、页脚和纪念票；
- 本切片只执行一次 `npm run verify`。随后只补充预览独有的 `npm run validate:locales:preview`、`npm run build:preview` 与 `npm run validate:build:preview`，不重复运行 `verify` 已包含的正式质量或构建门禁；
- 预期提交主题：`fix(ui): harden trilingual responsive typography`。

#### PLAN-01 切片完成证据

每次回合并到 `dev_blueprint` 时，只记录以下最小证据，不复制完整日志：

- `dev_code` 的切片提交 ID 与对应 Pull Request；
- 该切片规定的命令是否通过，以及未执行的浏览器或人工项目；
- 实际新增、删除或重命名的功能源码是否已进入追踪表；
- 是否出现必须回到正式蓝图处理的契约变化。

`S4` 完成不能仅凭静态检查认定视觉验收通过。若自动环境无法进行代表视口或打印检查，应保留明确的人工验收项，不以“构建成功”替代；这属于发布门禁，不授权继续向 `dev` 或 `main` 合并。

## 待解决问题

无产品或实现路线问题。正式蓝图迁移、计划执行、每次 Git 写入与最终人工视觉验收是权限或阶段门禁，不属于待猜测的设计问题。

## 正式拆分与影响定位

| 来源 ID      | 目标位置                                                                                                                                                                 | 影响性质   | 确认后的动作                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | -------------------------------------------------------------------------------- |
| `PLAN-01/S1` | `BP-FND-DOMAIN`、`BP-I18N-CORE`、`BP-CNT-CORE`、剧目索引、本地化 schema/解析器、炎国与哥伦比亚完整包入口、locale 验证、追踪表                                            | 重构       | 只做等价结构迁移并独立提交；双语言行为和产物必须保持                             |
| `PLAN-01/S2` | `BP-FND-DOMAIN`、`BP-CNT-CORE`、`BP-MOD-PROGRAMS`、剧目来源模块、地点、场次、炎国与哥伦比亚剧目内容、搜索、locale/build 验证、追踪表                                     | 新增、替代 | 保留原创内容，新增四项活页与九次里站场次，替代旧里站场次引用并独立提交           |
| `PLAN-01/S3` | `BP-I18N-CORE`、`BP-I18N-TERMS`、`BP-QLT-STAGES`、东国语完整包、预览集合、选择器、搜索/票务/污染状态与构建验证、README 和开发指南                                        | 新增、修正 | 加入零回退东国语预览和三语言功能等价门禁，不改变正式发布集合                     |
| `PLAN-01/S4` | `BP-FND-EXPERIENCE`、`BP-I18N-CORE`、`BP-QLT-STAGES`、日文与共享响应式样式、必要共享组件及验证脚本、`docs/drafts/blueprint/higashi-trilingual-preview.md` 中的 `TEST-01` | 修正、关闭 | 用真实页面结果完成日文适配并关闭测试项；最终同步正式蓝图后删除已完成草稿和本计划 |
