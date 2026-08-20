# 活页剧目标题参考

## 责任与来源边界

本文件是当前 13 项活页剧目标题形式及项目稳定 `productionId` 映射的唯一长期参考。标题由项目负责人提供并人工确认，来源定位为《傀影与猩红孤钻》相关活页剧目；本次迁移不重新核验外部页面。后续若发现来源差异，先保留现有稳定 ID 并交由人工确认标题修正，不静默覆盖。

本目录不参与网站运行。某条记录只有经过内容选择、补齐当前阶段所需字段并进入唯一运行时剧目注册表后，才成为可被 `Performance` 引用的 `Production`；保存标题不表示已经排演、发布或限定所属时间层。

## 标题与稳定 ID

`PROD-SRC-*` 只用于本参考内的来源定位。三种标题均只保存正文，不包含中文或日文包围书名号；`English` 是来源版本列，不表示标题中的词汇必须属于英语。

| 来源 ID       | `productionId`             | 中文       | English                   | 日本語             |
| ------------- | -------------------------- | ---------- | ------------------------- | ------------------ |
| `PROD-SRC-01` | `ode-au-triomphe`          | 凯旋颂     | Ode au Triomphe           | 凱旋の讃歌         |
| `PROD-SRC-02` | `der-ring`                 | 湖中至宝   | Der Ring                  | 湖中の至宝         |
| `PROD-SRC-03` | `one-hundred-and-one-days` | 一百零一日 | One Hundred and One Days  | 百日一日物語       |
| `PROD-SRC-04` | `lone-wander`              | 独行客     | Lone Wander               | 独り往く者         |
| `PROD-SRC-05` | `wonderland-in-dream`      | 梦中奇缘   | Wonderland in Dream       | 夢の国の冒険譚     |
| `PROD-SRC-06` | `frost-deer-and-snow-doe`  | 霜牡与雪牝 | Frost Deer and Snow Doe   | 霜の牡鹿と雪の牝鹿 |
| `PROD-SRC-07` | `light-of-heria`           | 赫里亚之辉 | Light of Heria            | ヘリアの輝き       |
| `PROD-SRC-08` | `sette-collis-mother-wolf` | 七丘的狼母 | Sette colli's Mother Wolf | 七丘の母狼         |
| `PROD-SRC-09` | `the-dawn`                 | 初晓       | The Dawn                  | 曙光               |
| `PROD-SRC-10` | `the-golden-fowlbeast`     | 金羽兽     | The Golden Fowlbeast      | 金色の羽獣         |
| `PROD-SRC-11` | `wild-gold`                | 狂野之金   | Wild Gold                 | ワイルドゴールド   |
| `PROD-SRC-12` | `the-lullaby`              | 摇篮曲     | The Lullaby               | 子守り歌           |
| `PROD-SRC-13` | `the-carnival`             | 欢欣鼓舞   | The Carnival              | カーニバル         |

## 使用规则

- `productionId` 由 `English` 来源形式一次性转换为小写 kebab-case：保留词序与冠词、空格转连字符、移除撇号和不适合 ID 的标点。表中 ID 已冻结，不在运行时从显示标题生成，也不因显示标题勘误自动改写；
- 中文形式对应 `zh-CN` 来源，日文形式对应 `ja-JP` 来源，`English` 先作为未区分地域的 `en` 来源。`en-US`、`en-GB` 或其他国家版本仍需分别纳入其开发范围和审核门禁；
- 标题记录不自动生成简介、体裁、主创、场次、搜索结果或详情页。运行时只为当前实际采用的剧目维护完整国家版本内容；
- `folio` 只表示标题来源类别。根据标题补写的简介、主创、场馆和演出记录仍是概念站创作，不得描述为活动已经确认的事实；
- 页面和组件不自动为标题增加书名号。某段正文确有语法需要时，由该段文案自行加入标点，不回写标题数据。
