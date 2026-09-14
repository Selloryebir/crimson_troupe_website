# 泰拉年历：剧团与九国历史对照

研究日期：2026-09-14。性质：有来源分层的研究数据，不是官方完整年鉴，不新增正式剧情，也不修改网站时间、语言或场次。范围为通行历法、猩红剧团／傀影／酒神，以及网站九国版本相关的代表性历史节点；不追求抄录全世界全部战争、神话、支线和联动。

## 数据入口

优先阅读[巡演与双站时间关联研究](temporal-analysis.md)：包含剧团身份链、螺旋桨天堂案例、16个地区影响窗口、1084可达性与7类失效快照候选。配套的[时间敏感度建议草稿](../../drafts/recommendations/temporal-sensitivity.md)列出当前仓库冲突、修正方案及人工审核项，均未进入正式契约。

| 文件                                                                                       | 用途                                                                                    |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| [`events.csv`](events.csv)                                                                 | 78 条事件；有日期的条目优先按开始时间排列，未定年及相对事件在后；稳定 ID 不代表历史顺序 |
| [`event-network.json`](event-network.json)                                                 | 87个节点、48条类型化关系、9项约束与6个不确定性判定样例；日期只引用事件表，不重复维护    |
| [`calendar-rules.csv`](calendar-rules.csv)                                                 | 10 项历法观察与保守的数据表示规则                                                       |
| [`country-context.csv`](country-context.csv)                                               | 9 国历史锚点、1084 语境推论、较晚事件与剧团关联证据                                     |
| [`date-claims.csv`](date-claims.csv)                                                       | 15 项需要保留原貌的日期主张，包含同一事件的不同来源判定                                 |
| [`open-questions.csv`](open-questions.csv)                                                 | 12 项未解问题、保守处理方式及下一步所需证据                                             |
| [`../../sources/terra-chronology/sources.csv`](../../sources/terra-chronology/sources.csv) | 63 个来源入口与访问方法；`source_ids` 的唯一解析表                                      |

CSV 使用 UTF-8，首行为字段名，多值以 `|` 分隔。Excel 可通过“从文本/CSV”导入，并将日期和 ID 列设为文本；直接双击可能把 `0001`、月日或年份自动改成地球日期。未生成内容相同的 XLSX 副本，避免形成两份可独立修改的资料。

## 核心判断

### 历法不等于年表

现有百科将通行历概括为十二个月、常年三百六十五天，并将纪元关联至萨尔贡的卢加萨尔古斯。该概括不足以证明完整公历置闰算法、地球纪元偏移或九国年号换算；炎国双月相关阴阳历与拉特兰纪元应另行保留，不能直接接入地球农历或公历转换库。[Terra 的 Calendar 节](https://arknights.wiki.gg/wiki/Terra)、[双月条目](https://arknights.wiki.gg/wiki/Twin_Moons)提供背景，`calendar-rules.csv` 明确区分来源观察和本研究约定。

### 剧团历史需要两种时间组织方式

可定年的国家史构成外部框架，人物经历则大量只有相对顺序。旧团长 `tragodia_founder` 与继承称号的卢西恩 `phantom_lucian` 必须分开；傀影和后继干员酒神属于同一人物的不同身份。英文名称采用来源中的 Tragodia，不因其神话意象而改为 Dionysus。[旧团长条目](https://arknights.wiki.gg/wiki/Tragodia_%28NPC%29)与[酒神档案](https://prts.wiki/w/酒神)支撑此区分。

《红丝绒》在 PRTS 年表位于 1100 年，英文年表保留“约 1099 至 1100 年初”；两者不是两个事件，也不能取交集后宣称 1100 年已经确定。英文脚注借后续文化交流中的影片提及建立先后关系，但未确定电影节与商业放映的时间差。因此 T015 保存候选年份包络，D01—D03 保存原判定，后继身份事件沿用这一不确定性。[PRTS 年表](https://prts.wiki/w/泰拉年表)、[英文年表及脚注 11](https://arknights.wiki.gg/wiki/Timeline)。

《傀影与猩红孤钻》的救援在英文年表中明确属于未定年；城堡建造、旧团成立、救援行动是三件事。漫画倒叙的“十四年前”缺少可确认的绝对参照年，不能套用游戏上线年，也不能机械从《红丝绒》减十四。生日仅支持每年 1 月 19 日，不支持出生年或年龄。[漫画梗概](https://arknights.wiki.gg/wiki/Prelude_Suite%3A_Blood_Diamond)、[傀影档案](https://prts.wiki/w/傀影)。

### 九国语境与多语言使用

国家覆盖按仓库 `src/data/editions.ts` 的九个 `editionId` 核对；其技术语言和可见名称仍以[正式本地化契约](../../blueprint/i18n/localization-contract.md)为准，本研究不维护第二套翻译注册表。

`country-context.csv` 的 1084 列是根据此前事件作出的研究推论，不是该年有官方年鉴记载剧团巡演。例如，维多利亚已经历王权断裂，莱塔尼亚已进入双子女皇时代，米诺斯已经结束占领；这些历史背景可用于检查时代错置，但不能证明网站原创剧目、人物或演出确曾存在。网站的 1084 快照依旧是项目叙事选择，不能据此给傀影补写当年经历。

补充调查报告支持旧剧团主要在维多利亚活动，并曾巡演莱塔尼亚、叙拉古和萨尔贡；哥伦比亚另有案件线索。这不等于九国均已有可确定的演出记录。[Supplemental Investigation Report](https://arknights.wiki.gg/wiki/Supplemental_Investigation_Report)。其余国家保留“本轮未取得”，而不是断言从未演出。

来自泰拉记事索引的莱茵生命年度报告可提供有限确年与确月；大学通知、员工备忘录和怪谈报告主要提供文化与叙述立场，并非每一份都能落到绝对日期。因此后几种只进入来源及国家背景，不为了充实年表而捏造事件年份。[莱茵生命研究报告](https://arknights.wiki.gg/wiki/Rhine_Lab_Research_Report)、[大学课程通知](https://arknights.wiki.gg/wiki/Neuleopold_University_Class_Notifications)、[东国怪谈报告](https://arknights.wiki.gg/wiki/Mitsukue_Paranormal_Reports)。

## 字段与判定规则

`events.csv`：

- `event_id`：稳定研究 ID；`countries` 包含事件涉及地及历史关系，不代表各国在该时点具有相同国界；`subjects` 为研究标签，不是新的运行时实体注册；
- `date_start`、`date_end`：保留来源已有精度的日期文本。单点结束值为空。区间含义必须结合 `date_note`：战争可表示持续范围，T015 则只表示候选日期包络；
- `date_precision`：`year`／`month`／`day` 为单点精度；`year_range`／`month_range`／`day_range`／`mixed_range` 为区间；`decade` 表示十年范围；`circa_year` 只有约年中心；`season` 的季节见备注；`relative`／`unknown` 不填绝对日期；
- `date_status`：`explicit` 表示已读官方文本转载明确标出日期，不是已验证官方原始介质，也不担保叙述绝对可信；`secondary` 为二手资料明确给年的归纳；`inferred` 为推算；`approximate` 为约数；`disputed` 为来源分歧；`relative`／`undated` 均不可直接作为绝对日期排序；
- `source_ids`、`source_locator`：证据与段落定位，来源访问限制必须同时阅读；`date_note` 保留推定过程、未验证部分与实体区别；
- `after_event_ids`：仅记录有依据的严格先后，不表示“紧接着发生”，空值也不表示不存在先后。章节先后、历史包络与事件内部组成不自动变成严格时间边。

`date-claims.csv` 记录有必要并列的判定，不重复所有事件日期。`disposition=retained` 表示保留这条主张而非认可唯一结论；`provisional` 表示尚缺直接复核；`unresolved` 表示仍有张力；`superseded` 表示已被更直接证据修正、只保留旧主张供追溯，不再约束事件日期。`calendar-rules.csv` 中 `research_convention` 是本研究的保守处理方法，不得标成游戏官方历法。

## 采用与更新边界

这些 CSV 不属于 `src/data/`，不得由运行时直接加载，也不自动替换正式日期或翻译。将来采用某一事实时，应先处理该条来源限制与待核实项，再通过正式内容与蓝图流程决定用途。九国背景列不适合直接当作 1084 页面可见文案：历史已发生，不等于当时的普通观众已知情。

本轮英文站存在 403 和动态原作获取限制，保留了搜索索引层证据；没有声称完成所有原作的逐字或逐格验收。本次已通过AD-8、AD-ST-3的连续索引文本与PRTS物件原文转载修正早期反抗、继承尾声和子爵请柬；102X是请柬落款，不是城堡建设的完整范围。后续优先核实《红丝绒》与螺旋桨天堂的定年分歧、古堡实际竣工下界及救援绝对年，再扩展国家事件。修改现有事实优先保留稳定 ID；若确为两件事，应拆分并说明，不以覆盖日期掩盖原有分歧。
