# 双时间层两年场次目录扩充一次性开发计划

- 文档类型：一次性开发计划
- 状态：已批准执行
- 规划效力：只约束本计划的切片顺序，不覆盖正式蓝图
- 分析基线：active 蓝图已规定前后一年闭区间、表站 `7 + 4`、里站 `9 + 8`、同时间层每项剧目最多三次及十四项可见剧目视觉；当前源码仍为表站 `3 + 0`、里站 `5 + 4` 和七项可见剧目
- 目的：先建立不泄漏的内容目录，再补七项独立视觉资产，最后发布扩充根集合并验证九语言页面、搜索、票务边界和污染闭包
- 非目标：改变现有 12 个场次、扩张现有可购票范围、采用克莱布拉松稳定场次、决定正式文案／翻译／票价／封面、启用流动时钟

## 正文

### PLAN-01｜两年场次目录分层交付

- 状态：已批准执行
- 正式依据：`BP-MOD-TERRA-TIME`、`BP-MOD-PROGRAMS`、`BP-CNT-CORE`、`BP-CNT-PRODUCTION-VISUAL`、`BP-I18N-CORE`、`BP-QLT-STAGES`
- 范围：新增四项活页剧目、16 个场次与九国家版本预览内容；为三项现有原创剧目和四项新增活页剧目生成独立封面；最后更新根集合、窗口／复用验证和代表浏览器流程
- 完成条件：表站公开七个未来／四个历史场次，里站公开九个未来／八个历史场次；全部 28 场位于各自窗口，每项剧目在同一时间层最多三次，里站只使用活页；七项新可见剧目有独立资产；既有三场表站票务和五场里站可售记录保持不变

#### PLAN-01 执行切片

| 切片 ID      | 状态         | 可观察交付结果                                                                                        | 前置依赖                                          | 候选影响路径                                                                                                                                                       | 验收方式                                                                                                                                                           |
| ------------ | ------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CATALOG-01` | 已批准待同步 | 内容库新增四项活页剧目、16 个稳定场次和九国家版本完整预览内容；根集合尚未采用，现有页面与票务范围不变 | `dev_code` 同步已迁移的正式蓝图                   | `src/data/productions/folio.ts`、`src/data/performances.ts`、九个 `src/data/localized/*/` 包、`src/data/content/localization-revisions.ts`、内容／locale／状态验证 | 项目类型和变更文件质量通过；内容库 28 个场次、14 个剧目关系合法；当前构建快照仍为 12 场／7 个剧目且新增 ID 不生成路由或搜索结果                                    |
| `ART-01`     | 待开始       | 七项即将公开的剧目各有独立无文字 WebP、Artwork 元数据、摘要和权利记录；仍不改变根集合                 | `CATALOG-01` 已提交、推送并同步回 `dev_blueprint` | `src/assets/images/productions/`、`src/data/production-artwork-assets.ts`、`src/data/production-artwork-manifest.ts`、`src/data/production-artworks.ts`、资产验证  | 图像可解码且宽高明确；七项 ID 各有唯一资产和焦点／裁切／记忆色／污染参数；当前产物不泄漏集合外资产；人工参考原图不进入仓库                                         |
| `PUBLISH-01` | 待开始       | 根集合发布 11 个表站和 17 个里站场次，页面、详情、搜索与污染自动扩展；现有票务候选数量不变            | `ART-01` 已提交、推送并同步回 `dev_blueprint`     | `src/data/content/root-sets.ts`、`src/data/content/validate.ts`、时间窗口辅助、构建／浏览器验证、README 与当前架构说明                                             | 运行一次完整 `verify`；随后只补九国家版本 preview 内容、构建、产物和浏览器验证，证明 `7/4/9/8`、两年窗口、最多三次、十四项资产、新增搜索／详情、污染递进和可靠退出 |
| `CLOSE-01`   | 待开始       | 两个长期分支同步全部验证成果，一次性计划被删除，仓库无生成临时文件                                    | `PUBLISH-01` 已完成并同步回 `dev_blueprint`       | 本计划、`docs/drafts/README.md` 及真实漂移位置                                                                                                                     | 最小文档检查、`git diff --check`、分支同提交与干净工作区                                                                                                           |

### PLAN-02｜获准的运行时编排输入

- 状态：已批准执行
- 正式依据：`BP-CNT-CORE`、`BP-MOD-PROGRAMS`、`BP-MOD-TERRA-TIME`
- 范围：为 `CATALOG-01` 提供唯一新增对象清单，为 `PUBLISH-01` 提供有序根集合输入
- 完成条件：对象键、对象内 ID、九语言记录键、详情 URL 和根集合引用逐项一致；现有 12 个场次保持原样

所有下列新增场次均使用一个所列剧目；历史项为 `completed / not-on-sale`，未来项为 `scheduled / not-on-sale`。本阶段不为它们新增座席图、报价或表站票篮资格。

#### PLAN-02 表站输入

| 集合 | `performanceId`                           | 日期时间           | `productionId`        | `locationId`     |
| ---- | ----------------------------------------- | ------------------ | --------------------- | ---------------- |
| 历史 | `caged-fire-jiangdu-1101-0521`            | `1101-05-21 19:30` | `caged-fire`          | `jiangdu`        |
| 历史 | `second-snow-zwillingsturme-1101-0808`    | `1101-08-08 20:00` | `second-snow`         | `zwillingsturme` |
| 历史 | `red-banquet-nuova-volsinii-1101-1119`    | `1101-11-19 19:00` | `red-banquet`         | `nuova-volsinii` |
| 历史 | `seventh-lantern-norport-1102-0202`       | `1102-02-02 18:45` | `seventh-lantern`     | `norport`        |
| 未来 | `red-banquet-montelupe-1102-0606`         | `1102-06-06 20:00` | `red-banquet`         | `montelupe`      |
| 未来 | `seventh-lantern-linqu-1102-1212`         | `1102-12-12 19:30` | `seventh-lantern`     | `linqu`          |
| 未来 | `procession-of-masks-londinium-1103-0214` | `1103-02-14 20:00` | `procession-of-masks` | `londinium`      |
| 未来 | `uncrowned-qingsui-1103-0404`             | `1103-04-04 19:00` | `uncrowned`           | `qingsui`        |

#### PLAN-02 里站输入

| 集合 | `performanceId`                                    | 日期时间           | `productionId`            | `locationId`     |
| ---- | -------------------------------------------------- | ------------------ | ------------------------- | ---------------- |
| 历史 | `lone-wander-wiesheim-1083-0814`                   | `1083-08-14 19:30` | `lone-wander`             | `wiesheim`       |
| 历史 | `wonderland-in-dream-londinium-1083-1109`          | `1083-11-09 20:00` | `wonderland-in-dream`     | `londinium`      |
| 历史 | `frost-deer-and-snow-doe-nuova-volsinii-1084-0125` | `1084-01-25 18:45` | `frost-deer-and-snow-doe` | `nuova-volsinii` |
| 历史 | `light-of-heria-zwillingsturme-1084-0608`          | `1084-06-08 19:00` | `light-of-heria`          | `zwillingsturme` |
| 未来 | `lone-wander-linqu-1084-0719`                      | `1084-07-19 19:30` | `lone-wander`             | `linqu`          |
| 未来 | `wonderland-in-dream-qingsui-1084-1116`            | `1084-11-16 20:00` | `wonderland-in-dream`     | `qingsui`        |
| 未来 | `frost-deer-and-snow-doe-jiangdu-1085-0122`        | `1085-01-22 18:45` | `frost-deer-and-snow-doe` | `jiangdu`        |
| 未来 | `light-of-heria-trimount-1085-0530`                | `1085-05-30 19:00` | `light-of-heria`          | `trimount`       |

四个新增 `folio` 为 `lone-wander`、`wonderland-in-dream`、`frost-deer-and-snow-doe`、`light-of-heria`。七项新资产消费者为上述四项以及现有 `red-banquet`、`seventh-lantern`、`procession-of-masks`；只制作各自实际采用时间层的资产。

## 待解决问题

无。执行对象、顺序、内容状态、票务边界、封面范围和验证矩阵均由正式蓝图与当前命令确定；AI 预览文案和原创封面的具体措辞、构图与技术参数由智能体在既有内容及艺术契约内完成，不提升为正式内容。

## 正式拆分与影响定位

| 来源 ID                           | 目标位置                                              | 影响性质   | 确认后的动作                                       |
| --------------------------------- | ----------------------------------------------------- | ---------- | -------------------------------------------------- |
| `PLAN-01 / CATALOG-01`、`PLAN-02` | `dev_code` 领域事实与九国家版本内容                   | 新增       | 建立不泄漏的完整内容目录并独立提交、推送、同步     |
| `PLAN-01 / ART-01`                | `dev_code` 运行时资产与 Artwork 数据                  | 新增       | 生成七项独立候选封面并独立提交、推送、同步         |
| `PLAN-01 / PUBLISH-01`、`PLAN-02` | `dev_code` 根集合、约束验证、页面消费者和当前实现说明 | 修正       | 发布根集合、完成跨层验证并独立提交、推送、同步     |
| `PLAN-01 / CLOSE-01`              | `dev_blueprint`、本计划与 `docs/drafts/README.md`     | 删除／收口 | 核对两个长期分支闭环后删除计划，不保留重复阶段日志 |
