# 活页剧目封面修复素材来源与权利边界

记录日期：2026-09-13。本记录说明本地来源、处理链、开发阶段的公开仓库存放范围与未解决的权利问题；不构成权利方授权。

## 来源与处理链

- 项目负责人在 `local-reference-materials/normal-folio/` 与 `local-reference-materials/crimson-folio/` 各提供 13 张低清 RGBA 图，并说明其为活页剧目封面官方原版设计图；原始取得渠道和原始版权声明尚未记录。
- `local-reference-materials/normal-folio-sr/` 与 `local-reference-materials/crimson-folio-sr/` 为 DeepAI SRGAN 放大参考，不作为文字、Logo、撕口 Alpha 或其他语义真值。
- 普通版经逐图与跨图审计的最终 RGBA 母版位于本地忽略目录 `.agent-work/folio-cover-restoration/optimized-normal-folio-v5/final/covers/`；猩红版母版位于 `.agent-work/folio-cover-restoration/optimized-crimson-folio-v1/final/covers/`。两套同名成对，最终 WebP 与母版解码后逐像素一致。
- 2026-09-13，项目负责人明确要求将两套修复结果纳入项目文件、让里站当前剧目引用普通版，并允许上传到公开项目仓库及按 `dev_experiment → dev_code → dev` 流程晋级。普通版与猩红版均归里站；猩红版的页面使用时机留待后续开发策略决定。
- 后续获准的里站污染设计将等级 0—3 分别对应普通版、约三分之一剧目的对应猩红版、全部对应猩红版及全部猩红版《摇篮曲》。配对图与投影专用图由当前快照显式引用，等级 3 投影不新建普通《摇篮曲》实体或路由；此次使用策略不改变图像母版及下述文件摘要。

## 仓库存放与使用

- `src/assets/images/archive/folio/normal/<productionId>.webp`：13 张，`1344×1840 RGBA`；当前构建快照实际采用的 8 张由 `src/data/production-artwork-manifest.ts` 与 `production-artwork-assets.ts` 引入里站。
- `src/assets/images/archive/folio/crimson/<productionId>.webp`：13 张，`1372×1880 RGBA`；目前仅为里站成对资源，不被页面导入或打包进网站产物。
- 两套均为无损 WebP。原始低清图、SRGAN JPEG、PNG 母版、过程稿和审计证据继续只留在忽略目录，不进入运行时或版本控制。
- 旧的原创里站预览图暂留在 `src/assets/images/productions/` 以便恢复；当前 8 个活页剧目不再引用它们。除这次显式实验外，其他剧目视觉仍遵守原创资产契约。

## 权利与署名状态

- 这些修复图保留参考原版的独特构图、字形、徽记和细节，**不是项目原创图像**；超分、重绘和格式转换本身不产生可自由再分发的许可。
- 当前没有可核验的权利方公开使用许可、署名条款或再分发授权记录；也不宣称获得鹰角网络、Hypergryph 或其他权利方认可。项目负责人允许上传到公开项目仓库及开发分支晋级，不替代权利方许可，也不自动批准网站公开部署。
- 在确认许可、署名与可部署范围并完成相应人工审查前，本素材不得视为正式发布合格资产；`rights: local-folio-restoration-preview` 表示这一未决状态，不能写成 `project-original` 或 `project-generated-art`。

## 完整性清单

下表为项目中无损 WebP 文件的 SHA-256。名称使用冻结的 `productionId`，同一行的普通版和猩红版为一一对应关系。

| productionId               | normal SHA-256                                                     | crimson SHA-256                                                    |
| -------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `der-ring`                 | `99a76a607f2350e0f420af2944c46196d0e694a0cd1d2324e2eacd1224de2de1` | `fffa0908c84205ed0248b888d8d2357ffb5d84556f95b40964e46adb696a2eed` |
| `frost-deer-and-snow-doe`  | `6ae2e6f769a453b72388676cf0a6c92db2ef4ba5147fa5c663f46b7d443deefe` | `18ceff009cb20c0a562b6b140fa3f2f093f9c078da134518ff1a036c55dbb678` |
| `light-of-heria`           | `d8a408ef2fc76af692a7f2e0feccbf870f4c7ac3cb9028253c80a9cd8e32efb8` | `e678f2c51fb0dd5fa2537059088c1964b8c656185782cf814d0d26bb6e299276` |
| `lone-wander`              | `5c18e4063bd2d1b066e0806d2d66ba4ec3a6ed765b17c9ba0b6035ece2ae5730` | `2fad3556e45c70b61d75de968f0b27b3fa93becec30bd9c275fb4396b8b9505a` |
| `ode-au-triomphe`          | `b29f12742735a873e0adb4ce53e682ea6b80066a56a153181caae3caefb7921e` | `69762f747ee0039ce0912a116708524c6c7305dcd362ccefa2117e3b6f0b621d` |
| `one-hundred-and-one-days` | `a2a11b87aac282f9beb66b3fea54552a2cf0ecb8921fc406d0f96df860261f73` | `172cd4a02f2a677422c4db9c9f1a7feaa369b915088648ad7c1d310eb514f2ec` |
| `sette-collis-mother-wolf` | `0ffdd6ba5b66cadc5efef90536b0e10cafef06856fcefc51b1ff5ce0821b604b` | `7b220359a5d6e37d1f55d64596c49f5a5cdd3b102b3fdeb2807d9074f5eaf062` |
| `the-carnival`             | `3c50ab6a1dd782bcc95bdcaff8939268960964dca767331c98c9292e2d64ae6d` | `8007714fbf0274f388a68dabaea23072f74a0437c8bdc12165560ec1f6d6e7bd` |
| `the-dawn`                 | `7654d0e9d30ba1308f00bef3a4bd29ef43e9e28efdc0c13ff603fa2797c656ff` | `f6b8748e8084c688c244118d55f9f803a9a266328d8edbd7db3ab37aedf601f9` |
| `the-golden-fowlbeast`     | `06f8907caad9380acbac09f91a93301609ec55adcd21c0ad3eae086aa63a1046` | `3c6f0d0b2dc4c85ddb300506850a51187c1aece3ee783beb652087469965cbf3` |
| `the-lullaby`              | `bed3b5dd862e428a958f6610e1deb86262be40df4e023ae50830a6d60ebdfebf` | `606a8ab4ea736924f58eebc23c7d25417e69c3d79c1cdc8e774c13ab7696f613` |
| `wild-gold`                | `9c7ee82688b9c0aea5892c0e550aece6990991b0a02419c690fa79ec8333352b` | `ba857a375cfaa8b2572a16936231f3575444c9287c4ff4ee37490ddfd13d0793` |
| `wonderland-in-dream`      | `b6b4075c806e07fa09c1be8c31445e6664403df387d910291bd57081f97a2c88` | `53caa56c53a304066c123aa606ab76372c648d616f7f39ddec8070df599dbb75` |
