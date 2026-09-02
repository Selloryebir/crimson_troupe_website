# 剧团 Logo 来源与权利记录

记录日期：2026-09-02

本文件只记录剧团 Logo 的本地来源、人工授权、生成关系和仓库存放边界。默认版本及使用规则由 `BP-CNT-PRODUCTION-VISUAL` 负责，运行时装配由 `TroupeMark` 负责。

## 本地来源与人工授权

项目负责人在本地忽略目录提供 `local-reference-materials/troupe_logo_fgd.png`，将其定义为剧团 Logo 正式稿；同目录 `crimson_medal_img/` 保存《傀影与猩红孤钻》蚀刻章参考。2026-08-31，项目负责人明确选择生成候选 A 与 D，指定 D 为未另行说明时的默认团标，并授权以 D 替换当前网站临时团标。2026-09-02，项目负责人进一步确认基于 D 生成的三种亮度与环境光候选各有用途，要求全部纳入项目仓库并按具体需求选择。

本次人工声明构成该非官方同人概念站内部的采用依据，但当前没有公开许可链接、原始文件再分发许可或权利方授权证明。项目不据此宣称获得鹰角网络、Hypergryph 或其他权利方认可。两个本地来源目录继续被 `.gitignore` 排除，原图不得提交、部署或作为网站请求资源。

## 生成与采用关系

- 候选使用内置 `imagegen` 生成；正式 Logo 只作为身份锚点，蚀刻章集合只用于归纳煤黑底板、旧金蚀刻、深红珐琅、分层边框和旧化语言；
- D 版“档案凹印”进入 `src/assets/brand/troupe-logo-primary.png`，由 Astro 生成运行时 WebP 与双密度资源；
- A 版“舞台印章”进入 `docs/project/troupe-logo-alternates/stage-plate.png`，只在未来人工明确指定时才可以提出运行时用途；
- 三种 D 版衍生稿使用 `gpt-image-1.5` 图像编辑接口，以 D 版运行时母版为唯一图像输入，分别作为暖幕、舞台亮金和辉光亮金环境版本保存在 `docs/project/troupe-logo-alternates/`；生成所用 API 密钥未写入仓库、图片或来源记录；
- 三种衍生稿均为 `1024 × 1024` RGBA PNG，但外围暖色环境光仍属于可见画面，不等同于适配任意背景的干净透明切图。它们在获得具体消费者、完成目标背景验收并迁入 `src/assets/brand/` 前不参与运行时构建；
- B 与 C 未获采用，不进入仓库资产、运行时构建或正式视觉规则；
- 生成稿中的 `CRIMSON TROUPE` 绶带属于装饰性品牌细节，页面继续以本地化 HTML 品牌名和链接可访问名称表达身份。

| 项目版本           | 仓库文件                                                                    | SHA-256                                                            | 采用身份                       |
| ------------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------ |
| D-Warm 暖幕凹印    | `docs/project/troupe-logo-alternates/archive-engraving-warm-ambient.png`    | `d6ee3ab2c1afa7ec9e4437eaceabd6186d943afdb3dc6a33232e9c90f0500319` | 已保留、非默认、无运行时消费者 |
| D-Bright 舞台亮金  | `docs/project/troupe-logo-alternates/archive-engraving-bright-ambient.png`  | `84d3a0bd2529786e1ba406832d670b3bd7d46e3e7e851fc333a17087a6dc96a8` | 已保留、非默认、无运行时消费者 |
| D-Radiant 辉光亮金 | `docs/project/troupe-logo-alternates/archive-engraving-radiant-ambient.png` | `66dd6175babf762a2644c9d675bb083a6c930e38ab788a932a423b524bf0264d` | 已保留、非默认、无运行时消费者 |

## 维护边界

1. 未明确指定变体时，新增或现有 `TroupeMark` 消费者都使用 D，不按表站、里站、污染等级、语言、路由或页面位置自动切换 A 或 D 的衍生稿。
2. 非默认版本只有在项目负责人指定具体消费者后，才可迁入 `src/assets/brand/` 并由运行时显式引用；不得让页面或构建器直接依赖 `docs/project/`。
3. A、D 及其衍生稿不得被描述为游戏官方蚀刻章；不得复制参考章的具体徽记、数字、标题、边框或独特构图。
4. 若后续获得公开许可、官方矢量源或更明确的署名和再分发条款，应先更新本文件，再判断运行时资产和非官方声明是否需要调整。
