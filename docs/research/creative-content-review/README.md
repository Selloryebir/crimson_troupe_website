# 当前演出创意审查

这里保存一次可失效的开发审查记录，不是新的年鉴、演出内容库、正式内容批准或永久审批台账。流程由[演出创意审查与替换](../../guides/creative-content-review.md)规定，运行时不读取本目录。

[`current.json`](current.json) 包含上次实际审查的输入文件摘要、五个审查维度的证据及结论、仍需考据或改进的发现。脚本只验证记录与当前输入对应，不能证明语义结论正确。新的实际审查覆盖此文件，历史由 Git 保存，不积累逐次日志。

## 使用

```bash
npm run review:creative:plan
# 智能体读取变化与来源，实际审查后编写报告；不得用下面命令代替判断。
npm run review:creative:record -- .agent-work/creative-review/report.json
npm run review:creative
```

计划输出的 `fingerprint` 必须与报告及当前文件一致。内容再次修改后，旧报告拒绝登记。`scope.paths` 覆盖本次变化（包括删除），证据定位可以引用仍存在的来源或已记录的被删文件。格式与字段可通过 `node scripts/creative-review.mjs --help` 查看。

报告至少包含 `schemaVersion`、`fingerprint`、`classification`、`summary`、`scope`、`axes` 和 `findings`。五轴固定为 `chronology / worldview / consistency / snapshots / localization`，每轴必须有结论和可定位证据；空报告不算完成。纯排版／等价重构使用有具体理由的 `no-creative-change`，而不是伪造一次新的年鉴研究。

`blocking` 是需要解决的确定阻塞，门禁失败；`needs-research` 与 `advisory` 保留待考据与改进建议，不自动阻止现有未批准预览，也不能因此进入正式发布。不能把证据不足、来源争议或人工已采纳的原创前提直接标成确定冲突。

增量报告默认继承已有发现。关闭发现必须进行 `semantic-review`，在 `resolutions` 中逐项提供原发现的 `findingKey`、非空 `reason` 与可定位 `evidence`；键由脚本导出的 `getFindingKey` 计算。允许通过其他文件的新证据关闭问题，不要求修改原定位文件；仅修改空白或无关字段也不能通过省略发现将它消除。登记时检查新旧记录的闭环；PR 及设置 `CREATIVE_REVIEW_BASE_REF` 的本地检查还对照目标提交中的旧记录，直接编辑 JSON 也不能静默消项。保存后只保留当前记录，不引入永久审批台账。客观缺陷可在修正并复核后由智能体关闭；项目前提、叙事方向、正式翻译和有争议的来源取舍仍需人工决定。

完整检查通过仍不等于九种官方译文获批或任意年代可演出。机器只执行可证明的引用、状态、摘要及闭包检查；AI 负责结合证据判断语义并给建议，人工负责内容方向与正式资格。

## 首轮基线边界

本轮在 `dev_experiment_terra_terminology` 完成。该分支尚未吸收技术优化晋级；已核对其场次、地点、根集合、中文正文与项目时间前提和 `origin/dev_code` 一致，九版本创意数据也没有因上一轮技术优化变更。主线已修复的日期格式化问题不重复记作当前网站新缺陷；研究分支的技术差异应在后续获准同步时按正常 Git 历史处理。

本轮依据仓库现有年鉴和术语来源登记开展，不宣称重新阅读全部官方原文或覆盖尚未登记的新剧情。术语候选保留原有证据等级，未批量替换专名、重编演出、改变艺术方向或批准译文。原 `terminology-maintenance` 草稿中的具体候选选择仍未整体迁为正式设定；本次生效的是主动审查、替换和 AI 预览翻译的工作方法。
