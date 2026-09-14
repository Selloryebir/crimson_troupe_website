# 泰拉年历来源登记

记录日期：2026-09-14。研究入口为用户指定的 [PRTS《泰拉年表》](https://prts.wiki/w/泰拉年表)与 [Terra Historicus](https://arknights.wiki.gg/wiki/Terra_Historicus)，沿其事件、人物、国家和衍生档案链接扩展。逐项来源身份、网址、语言、定位和访问限制见 [`sources.csv`](sources.csv)；综合事件及判定见 [`../../research/terra-chronology/README.md`](../../research/terra-chronology/README.md)。

## 来源层级

PRTS 年表是社区编辑的剧情时间整理，页首提示日期有推断成分。Terra Historicus 页面则是官方“泰拉记事”衍生内容的百科索引，不是英文年表；英文年代对照另使用 [Arknights Timeline](https://arknights.wiki.gg/wiki/Timeline)。官方入口本轮重定向至 [泰拉记事漫画站](https://comic.hypergryph.com/)。

登记中的 `evidence_kind` 区分：

- `official_text_reproduced`：Wiki 转载的官方剧情、干员档案或衍生报告；不是已经核验官方原始画面，也不意味着世界内叙述者全知可靠；
- `official_synopsis_reproduced`：官方关卡梗概的转载，不代替完整对话；
- `community_timeline`、`community_article`、`community_synopsis`：社区编排、解释或梗概；即使引用官方书页，未读原页仍只按二手证据处理；
- `community_index`、`official_portal`：检索入口或出版身份依据，不单独证明其全部链接内容。

## 访问覆盖与限制

`access_method` 为 `page_text` 时取得可读页面文字；`search_index` 表示取得搜索服务返回的网页索引摘录；`page_text_and_search_index` 表示两者结合；`landing_only` 只验证入口与跳转。来源没有保存固定修订号，故应以访问日期理解这份登记，不能声称未来仍与站点最新内容一致。

英文 Wiki 多个正文请求返回 403，本轮使用其可读索引交叉核查，未绕过访问控制。漫画动态原页未逐格取得；《血钻》情节使用明确标记为社区梗概的 S10，PRTS 的 S11 用于核对漫画身份和章节入口。本次扩展通过S41、S42的连续索引对话复核AD-8的两次反抗与AD-ST-3尾声相对时间，仍只称官方文本转载的索引证据，不称原客户端已验收。S40取得可读物件文字，修正了请柬落款与古堡建设期的混淆。

“关注九国年鉴”在本研究中指九国历史背景与纪年线索，并非已获得九份独立的官方年鉴。九个网站版本也不等于九种官方游戏译本；本轮事实来源主要为中文和英文，另以日文社区年表S47对照螺旋桨天堂日期分歧。S63的中文组织年鉴支持1101年份，但不能给出事故确日。未核验的俄、意、希、德、波等正式译文不凭项目 UI 翻译补造。

## 权利与使用边界

本登记保存链接、来源身份和定位，不保存整本设定集、漫画画面、游戏对话全文或第三方素材。研究 CSV 为自行编写的简短事实归纳与判定，不是逐字官方正文。Wiki 编辑文本与其引用的官方作品有不同权利层次；引用链接不产生素材再分发授权，也不使项目获得官方认可。以后若增加逐字摘录或资产，应单独核对对应页面许可及原作品权利。

来源 ID 一经建立不因文件排序变化而重编。更新日期或结论时，应先核实原文，再同步研究中的引用、精度与争议记录；不得把后续项目创作反向写成外部事实。
