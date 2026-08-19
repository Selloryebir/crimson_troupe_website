# 构建蓝图

蓝图是源码之上的正式构建框架：它记录稳定的用户目标、行为契约、边界、状态和阶段标准，但不复制实现代码，不充当任务列表，也不保存审查流水账。尚在讨论的蓝图草稿和候选建议统一位于 [`docs/drafts/`](../drafts/README.md)，不属于本目录的有效契约。

## 开发前的读取顺序

1. 阅读根目录 `AGENTS.md`；
2. 阅读本文件；
3. 对准备修改的功能源码运行 `npm run blueprint:where -- <路径...>`；
4. 阅读命令返回的主要及相关蓝图，再检查源码调用关系；
5. 实施满足需求的最小完整改动。

对尚未存在的新功能，先从下方目录找到最接近的基础契约。只有它确实拥有独立用户目标、状态或演进方向时，才从 `blueprint-template.md` 创建新蓝图。

## 目录职责

```text
docs/blueprint/
├── README.md                  # 使用入口与维护原则
├── blueprint-template.md     # 新蓝图的最小示例
├── traceability.json         # 蓝图、依赖与功能源码的唯一映射
├── foundation/               # 平台、体验、叙事状态与扩展机制
├── modules/                  # 可独立演进的用户能力
├── content/                  # 上线内容的数据与发布边界
├── i18n/                     # 本地化和术语契约
└── quality/                  # Demo 到 Formal 的统一阶段标准
```

临时规划、建议、创意草案和一次性开发计划位于 `docs/drafts/`，外部依据位于 `docs/references/`，运行时内容位于 `src/data/` 或未来唯一的 `src/content/`。实施计划、测试输出、审核记录和翻译覆盖率报告不属于蓝图。

普通功能开发只以本目录和 `traceability.json` 为产品依据。只有任务涉及规划讨论、草稿评审、已获授权的一次性开发计划或人工明确要求正式迁移时，才读取 `docs/drafts/`；一次性计划只补充执行顺序，其他草稿内容不得自行覆盖正式蓝图。

## 蓝图的最小内容

一份蓝图通常只需要回答：

- 用户结果和适用边界是什么；
- 谁拥有状态，输入、输出和失败路径是什么；
- 它如何影响表站、里站、内容和本地化；
- Demo 已保证什么，Formal 还需补充什么；
- 哪些可观察结果可以证明契约成立。

蓝图不规定函数名、逐行步骤或临时文件布局。源码路径统一放在 `traceability.json`，避免正文和追踪表产生两套事实源。

## 稳定 ID 与追踪关系

ID 使用 `BP-<领域>-<能力>`：

- `FND`：基础框架；
- `MOD`：功能模组；
- `CNT`：内容系统；
- `I18N`：本地化；
- `QLT`：阶段和质量。

`traceability.json` 中每个功能源码有一个 `primary` 蓝图，并可通过 `related` 关联其他约束。蓝图通过 `dependsOn` 表达稳定依赖。JSON 不支持注释，下面的注释示例只解释字段，不应原样复制到实际文件：

```jsonc
{
  "id": "BP-MOD-SEARCH", // 稳定 ID；文件改名时不改变
  "document": "docs/blueprint/modules/search.md",
  "status": "active", // 蓝图状态：active、retired
  "stage": "demo", // 实现成熟度：planned、demo、candidate、formal
  "dependsOn": ["BP-FND-CORE"],
}
```

源码映射中的 `primary` 表示主要设计责任，`related` 只列出会实际约束该文件的其他蓝图。不要为了“显得完整”关联所有基础蓝图。

`active` 是当前有效的正式约束；`retired` 表示蓝图已经终止，不再约束开发。`docs/blueprint/` 中不使用 `draft` 状态：尚未采纳的新蓝图和修改稿统一留在 `docs/drafts/blueprint/`。草稿获人工采纳后默认以 `active` 进入或修正正式蓝图，除非人工明确要求终止。`retired` 蓝图不得继续被启用蓝图依赖，也不得出现在源码的 `primary` 或 `related` 映射中。

## 双向工作流

从源码反查蓝图：

```bash
npm run blueprint:where -- src/scripts/search.ts src/data/search-index.ts
```

从蓝图检查候选影响范围：

```bash
npm run blueprint:impact -- BP-MOD-SEARCH
```

影响范围包含直接映射和依赖该蓝图的能力。它表示“需要判断”，不是“必须修改”。只有目标、行为、状态、接口、失败路径或阶段边界实际改变时才更新源码或蓝图。

新增、删除或重命名 `.astro`、`.ts`、`.css` 功能源码时维护追踪表。统一检查命令会报告失效路径、未知 ID、依赖环和未映射功能源码：

```bash
npm run blueprint:check
```

## 克制原则

- 一份蓝图对应一个能够独立变化的能力，不对应一个文件或小函数；
- Git 已经保存历史，不在蓝图重复撰写变更日志；
- 普通、可逆的局部实现决定留在代码中，不创建额外决策记录；
- 纯内部重构和等价修复不需要为了留下痕迹而改蓝图；
- 日常验证通过 `npm run quality -- <本次改动路径...>` 只调度受影响检查；达到完整门禁条件时只运行一次 `npm run verify`，不在其前后重复运行 `quality:full` 或 `build`；
- 只有现有边界造成真实冲突或重复修改时才继续拆分。

当前体验基线见 [`foundation/experience-system.md`](foundation/experience-system.md)，可复制的写法见 [`blueprint-template.md`](blueprint-template.md)，真实模组示例见 [`modules/search.md`](modules/search.md)。
