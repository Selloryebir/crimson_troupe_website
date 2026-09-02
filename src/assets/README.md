# 静态资产

本目录用于网站运行时直接加载且项目拥有使用权的图片、图标、字体或音频。

按实际需要创建 `images/`、`icons/`、`fonts/`、`audio/` 等子目录，不为空目录添加占位文件。第三方来源、许可和署名记录统一放在 `docs/sources/`；来源分析与转译理由进入 `docs/research/`。

剧目复杂中央图像位于 `images/productions/`，只保存已经通过艺术方向门且存在运行时消费者的原创压缩资产；本地参考图、过程稿和无消费者候选不得进入本目录。标题、正文、替代文本与交互仍由页面和类型化本地化内容承担。

`brand/` 保存经过人工采纳、权利边界已记录且拥有明确运行时消费者的品牌母版。团标默认使用透明高分辨率 D 版凹印母版，由 Astro 在构建期生成 WebP 与双密度输出；剧目封面、站点页头及其他未明确指定变体的 `TroupeMark` 消费者必须复用该文件，不逐处复制近似轮廓。来源和人工授权边界见 `docs/sources/troupe-logo-provenance.md`；已保留但尚无运行时消费者的 A 版和 D 版环境光变体位于 `docs/project/troupe-logo-alternates/`，不得由构建器直接读取。

`realm-badges/` 保存九个已注册国家版本的透明单色 SVG 母版。文件以稳定 `editionId` 命名，由语言选择器通过 CSS mask 和 `currentColor` 着色；选择器构建范围仍由国家版本注册决定。制作与复核规则见 `docs/guides/realm-badge-authoring.md`，非运行时上色候选只保存在 `docs/project/realm-badge-color-previews/`。

`pollution/` 保存项目原创的污染环境视觉母版。纯装饰且不随内容变化的大型画板应优先合并为单一矢量资产，由 CSS 保留位置与显示状态，避免在滚动期间反复绘制多层渐变、裁切与模糊阴影；文本投影和可交互内容不得烧录进资产。
