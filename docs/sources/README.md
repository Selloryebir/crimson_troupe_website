# 来源记录

`docs/sources/` 保存需要长期核对的外部来源事实、逐字官方内容与素材权利记录。它回答“外部来源实际提供了什么”，不保存项目设计分析、未采纳提案或当前运行时行为。

## 当前记录

- [`official-folio-productions.md`](official-folio-productions.md)：人工确认的 13 项官方活页剧目中／英／日标题、官方简体中文描述及稳定 `productionId` 映射；
- [`realm-badge-provenance.md`](realm-badge-provenance.md)：九枚国家徽章本地参考的来源与权利边界，以及用于核实国家语境的官方公开来源；
- [`ticketing-platform-logo-provenance.md`](ticketing-platform-logo-provenance.md)：现实票务平台本地参考、水稻网与跳楼机正式原创 SVG 的来源、权利和采用边界。

## 维护规则

- 逐字内容保持原段落、标点、语言和来源身份；项目翻译、改写与叙事扩展不能回写为官方正文；
- 来源记录可以保存与运行时稳定 ID 的映射，但映射不表示内容已经被项目采用、排演或发布；
- 事实摘录与项目推断分离。需要解释来源如何支持设计时，在 `docs/research/` 记录分析；已经采纳的项目结果进入 `docs/blueprint/`、`docs/project/` 或 `src/`；
- 素材记录必须包含许可、署名、再分发和仓库路径边界。无法提供公开许可时，应明确记录人工声明及尚缺证据，不把本文件当作新增授权；
- 运行时必须保存的来源值可以在 `src/data/` 建立可执行镜像，但应通过验证器核对，避免形成两份可独立修改的权威内容。
